from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import get_db
from models import Compound, Reaction, ReactionComponent
from schemas import CompoundCreate, CompoundRead, ReactionRead, ReactionCreate
from chemistry import compute_properties
from crud import get_or_create_compound

# FastAPIインスタンスの生成
app = FastAPI()

# デコレータを用いて，関数health()はURL"/health"に対する操作であることをappに登録する
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/compounds", response_model=CompoundRead, status_code=201)
# status_code=201
#   作成完了のステータスコード
# payload: CompoundCreate
#   リクエストのjson型をCompoundCreate型に変換
# db: Session = Depends(get_db)
#   関数実行前にdbにget_db()の結果を代入する
def create_compound(payload: CompoundCreate, db: Session = Depends(get_db)):
    compound, created = get_or_create_compound(db, payload.smiles, payload.name, payload.density)
    # この時点で有効かつ既存でないSMILESの場合はSMILESからRDKitにより計算された各特性値がdbに追加される
    # smilesの不正チェック（422不正入力）
    if compound is None:
        raise HTTPException(status_code=422, detail="invalid SMILES")
    # inchikeyの重複チェック（409は競合）
    if not created:
        raise HTTPException(status_code=409, detail="compound already exists")
    # **で辞書をキーワード引数に展開
    db.commit()
    db.refresh(compound)
    return compound

@app.get("/compounds", response_model=list[CompoundRead])
def list_compound(db: Session = Depends(get_db)):
    return db.scalars(select(Compound)).all()

@app.get("/compounds/{compound_id}", response_model=CompoundRead)
def get_compound(compound_id: int, db: Session = Depends(get_db)):
    obj = db.get(Compound, compound_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="compound not found")
    return obj

@app.post("/reactions", response_model=ReactionRead, status_code=201)
def create_reaction(payload: ReactionCreate, db: Session = Depends(get_db)):
    reaction = Reaction(
        exp_code=payload.exp_code, date=payload.date,
        scale=payload.scale, conc=payload.conc, note=payload.note,
    )
    for c in payload.components:
        compound, _ = get_or_create_compound(db, c.smiles, c.name)
        if compound is None:
            raise HTTPException(422, detail=f"invalid SMILES: {c.smiles}")
        # relationship経由でSQLAlchemyが自動的にcompoundsテーブルの外部キーを埋める
        reaction.components.append(
            ReactionComponent(
                compound=compound, role=c.role,
                equiv=c.equiv, yield_percent=c.yield_percent,
            )
        )
    db.add(reaction)
    db.commit()
    db.refresh(reaction)
    return reaction

@app.get("/reactions", response_model=list[ReactionRead])
def list_reaction(db: Session = Depends(get_db)):
    return db.scalars(select(Reaction)).all()

@app.get("/reactions/{reaction_id}", response_model=ReactionRead)
def get_reaction(reaction_id: int, db: Session = Depends(get_db)):
    obj = db.get(Reaction, reaction_id)
    if obj is None:
        raise HTTPException(404, "reaction not found")
    return obj

# リクエストを許可するオリジン・メソッド・ヘッダー
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Viteの開発サーバのオリジン
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pythonコード               SQL文
# ─────────────────────────────────────────
# db.add(obj)        →   INSERT INTO ... （flush/commitのタイミングで実行）
# db.delete(obj)     →   DELETE FROM ... （同上）
# db.get(Compound,1) →   SELECT * FROM compounds WHERE id = 1
# db.scalar(select…) →   SELECT ...
# db.scalars(select…)→   SELECT ...

# db.commit()        →   COMMIT          （トランザクション制御）
# db.rollback()      →   ROLLBACK        （トランザクション制御）
# db.flush()         →   SQL送信するがCOMMITしない（SQLに直接対応する文はない）
# db.refresh(obj)    →   SELECT ...      （内部的に再取得のSELECTが走る）
# db.close()         →   接続を閉じる（SQLではなくドライバレベルの操作）

# ターミナルで
# uvicorn main:app --reload
# を実行すると，main.pyを実行してappインスタンスを生成し，
# HTTPリクエストがくるたびに対応する関数を実行する
# --reloadはファイルが更新されると自動で再起動するオプション
