# SETUP.md — 環境構築手順

このプロジェクトを**まっさらな環境から動かす**ための手順書。
データの流れ: **SMILES入力 → RDKitで物性計算 → PostgreSQL保存 → FastAPIで提供 → Reactで表示**

構成は大きく3つ:

| 部分           | 場所            | 技術                                    |
| -------------- | --------------- | --------------------------------------- |
| バックエンド   | `eln_db/`       | Python (FastAPI + SQLAlchemy + Alembic) |
| フロントエンド | `eln_frontend/` | Node.js (React 19 + Vite)               |
| データベース   | （外部）        | PostgreSQL                              |

セットアップは **「①前提ツール → ②DB準備 → ③バックエンド → ④フロントエンド」** の順で進める。
特に **DBを先に用意してからでないとバックエンドが起動できない**点に注意（理由は手順③で後述）。

---

## ① 前提ソフトウェアのインストール

以下を先にインストールしておく。括弧内は確認コマンド（PowerShell）。

| ツール                | 用途                         | バージョン確認コマンド             |
| --------------------- | ---------------------------- | ---------------------------------- |
| **uv**                | Python本体とパッケージの管理 | `uv --version`                     |
| **PostgreSQL**        | データベース本体             | `psql --version`                   |
| **Node.js (npm同梱)** | フロントエンドのビルド・実行 | `node --version` / `npm --version` |
| **Git**               | リポジトリの取得             | `git --version`                    |

補足:
- **Python は個別にインストール不要**。`.python-version` で `3.14` を指定しているので、`uv` が必要なバージョンを自動で用意する。
- uv が未導入なら PowerShell で次を実行（公式インストーラ）:
  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```
- PostgreSQL は公式インストーラ（EDB版など）でインストールする。インストール時に設定した**スーパーユーザー（既定 `postgres`）のパスワードを必ず控えておく**こと。手順②で使う。

---

## ② データベースの準備（PostgreSQL）

このプロジェクトは **`eln_db` という名前のデータベース**に接続する設定が
`eln_db/database.py` にハードコードされている:

```python
# database.py 13行目
engine = create_engine(f"postgresql://{username}:{password}@localhost:5432/eln_db", echo=True)
```

つまり接続先は **`localhost:5432` の `eln_db`** で固定。これを先に作成する。

### 2-1. データベースを作成

PowerShell で psql に接続（パスワードを聞かれたら手順①で控えたものを入力）:

```powershell
psql -U postgres
```

接続できたら、psql の中で以下を実行してDBを作成し、抜ける:

```sql
CREATE DATABASE eln_db;
\q
```

> `\q` は psql を終了するコマンド。

### 2-2. （任意）専用ユーザーを作る場合

`postgres`（管理者）をそのまま使ってもよいが、専用ユーザーを切るならpsql内で:

```sql
CREATE USER eln_user WITH PASSWORD 'ここに任意のパスワード';
GRANT ALL PRIVILEGES ON DATABASE eln_db TO eln_user;
```

ここで決めた**ユーザー名とパスワードを手順③の `.env` に書く**。

---

## ③ バックエンドのセットアップ（`eln_db/`）

### 3-1. Python依存パッケージをインストール

リポジトリのルートで:

```powershell
uv sync
```

`uv sync` は `pyproject.toml` / `uv.lock` に従って仮想環境を作り、パッケージを入れる。

> **重要 — Alembic を追加する**
> 現状 `pyproject.toml` の依存に **`alembic` が含まれていない**。
> このままだと手順3-4のマイグレーションで `program not found` になるため、追加する:
> ```powershell
> uv add alembic
> ```
> `uv add` はインストールと同時に `pyproject.toml` へ記録するので、次回以降は `uv sync` だけで入る。

### 3-2. 接続情報（`.env`）を作成

`eln_db/.env` を新規作成し、手順②で決めたDBのユーザー名・パスワードを書く:

```dotenv
SQL_USERNAME = postgres
SQL_PASSWORD = ここにパスワード
```

> `.env` は認証情報を含むため、Gitにコミットしないこと（`.gitignore` で除外されているか確認）。
> `database.py` が `python-dotenv` でこのファイルを読み込み、接続URLを組み立てる。

### 3-3. なぜDBを先に用意する必要があるか

`database.py` は**読み込まれた瞬間にDBへ接続して動作確認をする**作りになっている:

```python
# database.py 19-20行目: import された時点で即実行される
with engine.connect() as conn:
    print(conn.execute(text("SELECT version()")).scalar())
```

そのため、**DB（手順②）と `.env`（手順3-2）が正しくないと、サーバ起動もマイグレーションも `import` の段階で失敗する**。順序を守ること。

### 3-4. テーブルを作成（Alembicマイグレーション）

`eln_db/` ディレクトリへ移動してから実行する（`alembic.ini` がそこにあるため）:

```powershell
cd eln_db
uv run alembic upgrade head
```

これで `compounds` / `reactions` / `reaction_components` の3テーブルが `eln_db` に作成される。

> - `uv run` を付けるのは、仮想環境内の `alembic` を使うため（付けないと `not recognized` になる）。
> - `upgrade head` = 最新のスキーマまで全マイグレーションを適用、の意味。
> - 確認: `uv run alembic current` で現在のリビジョンが表示されればOK。

### 3-5. バックエンドAPIサーバを起動

`eln_db/` ディレクトリで:

```powershell
uv run uvicorn main:app --reload
```

- 既定で `http://127.0.0.1:8000` で起動する。
- 動作確認: ブラウザで `http://127.0.0.1:8000/docs` を開くと、FastAPIの自動APIドキュメント（Swagger UI）が表示される。
- `/health` エンドポイントで稼働確認もできる。

---

## ④ フロントエンドのセットアップ（`eln_frontend/`）

別のターミナルを開き、`eln_frontend/` ディレクトリで:

```powershell
cd eln_frontend
npm install      # package.json に従い依存をインストール
npm run dev      # 開発サーバを起動
```

- 開発サーバは `http://localhost:5173` で起動する。
- `src/App.jsx` がバックエンドの `/compounds` を `fetch` して化合物一覧を表示する。
- **バックエンド（手順③）が起動していないとデータを取得できない**ので、両方を同時に起動しておくこと。

### Viteのセットアップ

```bash
# ルートディレクトリで実行
npm create vite@latest project_name -- --template react
cd project_name
npm install # package.jsonに従ってライブラリをインストール
npm run dev # サーバーの起動
```

---

## ⑤ 起動の全体像（2回目以降の日常起動）

一度セットアップが済めば、日常的に動かすのは次の2つのターミナルだけ:

```powershell
# ターミナル1: バックエンド
cd eln_db
uv run uvicorn main:app --reload

# ターミナル2: フロントエンド
cd eln_frontend
npm run dev
```

その上でブラウザで `http://localhost:5173` を開く。

---

## トラブルシューティング

| 症状                                                   | 原因と対処                                                                                            |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `alembic: not recognized` / `Failed to spawn: alembic` | `alembic` 未インストール。手順3-1の `uv add alembic` を実行。コマンドは `uv run alembic ...` の形で。 |
| `alembic ...` が「設定ファイルが無い」と言う           | 実行場所が違う。`alembic.ini` のある `eln_db/` で実行する。                                           |
| 起動時に `connection refused` / 認証エラー             | PostgreSQLが起動していない、または `.env` のユーザー名/パスワードが違う。手順②③を確認。               |
| `database "eln_db" does not exist`                     | DB未作成。手順2-1の `CREATE DATABASE eln_db;` を実行。                                                |
| `import` 直後にDB接続エラーで全コマンドが落ちる        | `database.py` がimport時に接続するため。DBと`.env`を先に整える（手順3-3参照）。                       |
| フロントに化合物が表示されない                         | バックエンドが未起動、またはCORS。まず手順③のサーバが起動しているか確認。                             |

---

## 各ディレクトリ早見表

```
Chemoinfomatics/
├── eln_db/          バックエンド（FastAPI + PostgreSQL接続 + Alembic）
│   ├── main.py          APIエンドポイント（/compounds, /reactions, /health）
│   ├── models.py        テーブル定義（SQLAlchemy ORM）
│   ├── database.py      DB接続（.env を読む / import時に接続確認）
│   ├── alembic/         マイグレーション履歴
│   ├── alembic.ini      Alembic設定（このディレクトリで alembic を実行）
│   └── .env             ★要作成: DB認証情報（Git管理外）
├── eln_frontend/    フロントエンド（React 19 + Vite）
├── PubChem/         PubChem API お試しスクリプト
├── project/         設計資料（ER図）
└── pyproject.toml   Python依存定義（★alembic を要追加）
```
