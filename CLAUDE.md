# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ケモインフォマティクス学習用の ELN（Electronic Lab Notebook）。  
データの流れ: **SMILES入力 → RDKitで物性計算 → PostgreSQL保存 → FastAPI提供 → React表示**

## よく使うコマンド

### Python（ルート / `eln_db/`）
```powershell
# 依存パッケージのインストール（ルート）
uv sync

# バックエンド起動（eln_db/ ディレクトリで実行）
uvicorn main:app --reload

# スクリプト実行例
uv run test_rdkit.py
uv run PubChem/pubchem.py
```

### フロントエンド（`eln_frontend/`）
```powershell
npm install
npm run dev      # 開発サーバ http://localhost:5173
npm run lint
npm run build
```

### DB マイグレーション（`eln_db/`）
```powershell
alembic upgrade head         # 生成されたマイグレーションを実際のDBに適用する
alembic revision --autogenerate -m "変更内容"  # models.py の変更を検知して、マイグレーションファイルを自動生成する
```

#### 補足

  典型的な流れ:
  1. models.py を編集（例: 列を追加）
  2. alembic revision --autogenerate -m "compoundsに沸点を追加" →
  eln_db/alembic/versions/ に変更内容を記述したPythonファイルが生成される
  1. 中身を確認
  2. alembic upgrade head で実際のPostgreSQLに反映

  head は「最新バージョンまで全部適用する」という意味です。逆に alembic downgrade  
  で1つ前に戻すこともできます。

## アーキテクチャ

```
eln_db/
├── main.py       APIエンドポイント（/compounds, /reactions, /health）
├── models.py     SQLAlchemy ORM（Compound / Reaction / ReactionComponent）
├── schemas.py    Pydantic 入出力スキーマ
├── crud.py       DBロジック（InChIKeyによる重複チェック付き get_or_create）
├── chemistry.py  RDKit で SMILES → 物性値（MW, 正確質量, LogP, InChIKey）計算
├── database.py   DB接続（.env から認証情報を読み込み）
└── alembic/      マイグレーション履歴

eln_frontend/
└── src/App.jsx   バックエンドの /compounds を fetch し化合物一覧を表示

PubChem/
└── pubchem.py    PubChemPy で外部DBから化合物情報を取得する実験スクリプト
```

**3テーブル構成:**
- `compounds` — SMILES・InChIKey・物性値（InChIKey に一意制約）
- `reactions` — 実験コード・日付・スケール・メモ
- `reaction_components` — 反応と化合物の中間テーブル（役割: reactant / reagent / solvent / catalyst / product、当量・収率）

## 環境変数

`eln_db/.env` に PostgreSQL 接続情報を記載:
```
SQL_USERNAME = ...
SQL_PASSWORD = ...
```

## 技術スタック

| 領域                | 技術                                   |
| ------------------- | -------------------------------------- |
| Python バックエンド | FastAPI, SQLAlchemy, Alembic, Pydantic |
| 化学計算            | RDKit, PubChemPy                       |
| DB                  | PostgreSQL                             |
| フロントエンド      | React 19, Vite                         |
| パッケージ管理      | uv（Python）/ npm（JS）                |
