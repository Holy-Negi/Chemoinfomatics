# ELN (Electronic Lab Notebook: 電子実験ノート) Project

化学構造（SMILES）から物性を計算し、化合物・反応情報を記録・閲覧・編集する。
反応の律速量（スケール）を入力すると、各成分の物質量・質量・体積（当量計算）も算出する。

## 全体構成

```
Chemoinfomatics/
├── eln_db/          バックエンド（FastAPI + PostgreSQL）
├── eln_frontend/    フロントエンド（React 19 + Vite + Material-UI）
├── PubChem/         PubChem API お試しスクリプト
├── test/            RDKit のお試しスクリプト・ER図（ER.dio）など
├── ER.svg           ER図（テーブル設計図）
├── SETUP.md         まっさらな環境から動かすための構築手順書
└── pyproject.toml   ルートの Python プロジェクト定義（uv 管理）
```

データの流れは **SMILES入力 → RDKitで物性計算 → DB保存 → REST APIで提供 → Reactで表示・編集** という一方向。

> 環境構築（PostgreSQL・依存インストール・マイグレーション・起動）の詳細な手順は [`SETUP.md`](./SETUP.md) を参照。

## 各ディレクトリの役割

### `eln_db/` — バックエンド（REST API）

FastAPI 製の API サーバー。SMILES を受け取り RDKit で物性を計算して PostgreSQL に保存する。

| ファイル           | 役割                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `main.py`          | API エンドポイント定義（`/compounds`, `/reactions`, `/health`）。CORS で Vite 開発サーバを許可 |
| `models.py`        | DBテーブル定義（SQLAlchemy ORM）。`Compound` / `Reaction` / `ReactionComponent` の3テーブル    |
| `schemas.py`       | 入出力のデータ形式（Pydantic）。リクエスト/レスポンスの型を規定                                |
| `crud.py`          | DB操作ロジック。InChIKey による重複チェック付きの「取得 or 新規作成」                          |
| `chemistry.py`     | RDKit で SMILES から物性（分子量・正確質量・logP・InChIKey）を計算                             |
| `stoichiometry.py` | 反応のスケール（律速量）と当量から各成分の物質量・質量・体積を計算                             |
| `database.py`      | DB接続設定。`.env` から認証情報を読み込み PostgreSQL に接続                                    |
| `alembic/`         | DBマイグレーション（スキーマ変更履歴）の管理                                                   |

**データモデル概要**

- `Compound`（化合物）: 名前・SMILES・InChIKey・物性値（分子量・正確質量・logP）・密度。InChIKey は一意制約で重複防止
- `Reaction`（反応）: 実験コード・日付・スケール・濃度・メモ
- `ReactionComponent`（反応成分）: 反応と化合物を繋ぐ中間テーブル。役割（reactant / reagent / solvent / catalyst / product）・当量・収率を保持

**主なAPIエンドポイント**

| メソッド       | パス                          | 役割                                               |
| -------------- | ----------------------------- | -------------------------------------------------- |
| GET            | `/health`                     | 稼働確認                                           |
| GET/POST       | `/compounds`                  | 化合物の一覧取得（`?q=` で名前検索）／新規作成     |
| GET/PUT/DELETE | `/compounds/{id}`             | 化合物の取得／更新／削除                           |
| GET/POST       | `/reactions`                  | 反応の一覧取得（`?q=` で実験コード検索）／新規作成 |
| GET/PUT/DELETE | `/reactions/{id}`             | 反応の取得／更新／削除                             |
| GET            | `/reactions/{id}/equivalents` | 当量計算（`?scale=` でスケールを上書き可）         |

起動: `uv run uvicorn main:app --reload`（`eln_db/` ディレクトリで実行）

### `eln_frontend/` — フロントエンド

React 19 + Vite + Material-UI 製の画面。化合物・反応を一覧表示し、フォーム／ダイアログから登録・編集・削除できる。

| ファイル                  | 役割                                                 |
| ------------------------- | ---------------------------------------------------- |
| `App.jsx`                 | 画面全体の組み立て（各テーブルを配置）               |
| `CompoundTable.jsx`       | 化合物一覧の表示・検索・削除                         |
| `CompoundForm.jsx`        | 化合物の新規登録フォーム                             |
| `CompoundEditDialog.jsx`  | 化合物の編集ダイアログ                               |
| `ReactionTable.jsx`       | 反応一覧の表示・検索                                 |
| `ReactionItem.jsx`        | 反応1件の行（展開で成分を表示）                      |
| `ReactionForm.jsx`        | 反応の新規登録フォーム                               |
| `ReactionEditDialog.jsx`  | 反応の編集ダイアログ                                 |
| `ComponentRowsEditor.jsx` | 反応成分（化合物・役割・当量・収率）の入力行エディタ |
| `EquivalentTable.jsx`     | 反応のスケールを入力して当量計算結果を表示           |

起動: `npm install` → `npm run dev`（開発サーバ [http://localhost:5173](http://localhost:5173) ）

### `PubChem/` — 外部DB連携の実験

`pubchempy` で PubChem から化合物情報（CID・物性・3D構造など）を取得するお試しスクリプト。

### `test/` — お試し・設計資料

RDKit の動作確認スクリプト（`test_rdkit.py`）や、draw.io（diagrams.net）形式の ER図（`ER.dio`）など。

## 技術スタック

| 領域           | 技術                                   |
| -------------- | -------------------------------------- |
| 言語           | Python 3.14 / JavaScript (ES Modules)  |
| バックエンド   | FastAPI, SQLAlchemy, Alembic, Pydantic |
| 化学計算       | RDKit, PubChemPy                       |
| DB             | PostgreSQL                             |
| フロントエンド | React 19, Vite, Material-UI (MUI)      |
| パッケージ管理 | uv（Python） / npm（JS）               |

## TODO

- 構造式での部分検索を実装
- CompoundsとReactionsでページを分ける
- UIの調整
- 試薬の在庫量を計算する機能の実装
