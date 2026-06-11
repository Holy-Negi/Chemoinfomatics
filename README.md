# Chemoinfomatics

ケモインフォマティクスの学習用プロジェクト。化学構造（SMILES）から物性を計算し、化合物・反応を記録・閲覧する **ELN（Electronic Lab Notebook：電子実験ノート）** を、バックエンド・フロントエンド・周辺スクリプトに分けて実装している。

## 全体構成

```
Chemoinfomatics/
├── eln_db/          バックエンド（FastAPI + PostgreSQL）
├── eln_frontend/    フロントエンド（React + Vite）
├── PubChem/         PubChem API お試しスクリプト
├── project/         設計資料（ER図）
├── main.py          動作確認用のエントリポイント
├── test_rdkit.py    RDKit のお試しスクリプト
└── pyproject.toml   ルートの Python プロジェクト定義（uv 管理 / rdkit 依存）
```

データの流れは **SMILES入力 → RDKitで物性計算 → DB保存 → REST APIで提供 → Reactで表示** という一方向。

## 各ディレクトリの役割

### `eln_db/` — バックエンド（REST API）
FastAPI 製の API サーバー。SMILES を受け取り RDKit で物性を計算して PostgreSQL に保存する。

| ファイル | 役割 |
|----------|------|
| `main.py` | API エンドポイント定義（`/compounds`, `/reactions`, `/health`）。CORS で Vite 開発サーバを許可 |
| `models.py` | DBテーブル定義（SQLAlchemy ORM）。`Compound` / `Reaction` / `ReactionComponent` の3テーブル |
| `schemas.py` | 入出力のデータ形式（Pydantic）。リクエスト/レスポンスの型を規定 |
| `crud.py` | DB操作ロジック。INCHIKey による重複チェック付きの「取得 or 新規作成」 |
| `chemistry.py` | RDKit で SMILES から物性（分子量・正確質量・logP・InChIKey）を計算 |
| `database.py` | DB接続設定。`.env` から認証情報を読み込み PostgreSQL に接続 |
| `alembic/` | DBマイグレーション（スキーマ変更履歴）の管理 |

**データモデル概要**
- `Compound`（化合物）: 名前・SMILES・InChIKey・物性値。InChIKey は一意制約で重複防止
- `Reaction`（反応）: 実験コード・日付・スケール・濃度・メモ
- `ReactionComponent`（反応成分）: 反応と化合物を繋ぐ中間テーブル。役割（reactant / reagent / solvent / catalyst / product）・当量・収率を保持

起動: `uvicorn main:app --reload`

### `eln_frontend/` — フロントエンド
React 19 + Vite 製の画面。`src/App.jsx` がバックエンドの `/compounds` を `fetch` し、化合物一覧を表で表示する。

起動: `npm install` → `npm run dev`（開発サーバ http://localhost:5173 ）

### `PubChem/` — 外部DB連携の実験
`pubchempy` で PubChem から化合物情報（CID・物性・3D構造など）を取得するお試しスクリプト。

### `project/` — 設計資料
`ER.dio` … draw.io（diagrams.net）形式の ER図（テーブル設計図）。

## 技術スタック

| 領域 | 技術 |
|------|------|
| 言語 | Python 3.14 / JavaScript (ES Modules) |
| バックエンド | FastAPI, SQLAlchemy, Alembic, Pydantic |
| 化学計算 | RDKit, PubChemPy |
| DB | PostgreSQL |
| フロントエンド | React 19, Vite |
| パッケージ管理 | uv（Python） / npm（JS） |
