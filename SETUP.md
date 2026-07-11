# 環境構築手順

| 部分           | 場所            | 技術                                    |
| -------------- | --------------- | --------------------------------------- |
| バックエンド   | `eln_db/`       | Python (FastAPI + SQLAlchemy + Alembic) |
| フロントエンド | `eln_frontend/` | Node.js (React 19 + Vite)               |
| データベース   | （外部）        | PostgreSQL                              |

---

## ① 前提ソフトウェアのインストール

| ツール                | 用途                         | バージョン確認コマンド             |
| --------------------- | ---------------------------- | ---------------------------------- |
| **uv**                | Python本体とパッケージの管理 | `uv --version`                     |
| **PostgreSQL**        | データベース本体             | `psql --version`                   |
| **Node.js (npm同梱)** | フロントエンドのビルド・実行 | `node --version` / `npm --version` |

- **uv**

  uvはpythonのパッケージマネージャーです。必要なライブラリを一括でインストールするのに使用します。
インストールするにはターミナルで以下のコマンドを実行します。

  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```
- **PostgreSQL**

  [公式サイト](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)（EDB版など）からインストーラをダウンロードし、インストールします。パスワードを控えておいてください。

- **Node.js**

  [公式サイト](https://nodejs.org/ja/download)からインストーラをダウンロードし、インストールします。

---

## ② データベースの準備（PostgreSQL）

### 2-1. データベースを作成

PowerShellでpsqlに接続します。インストール時に設定したパスワードを入力します。

```powershell
psql -U postgres -p
```

接続できたら、以下を実行してデータベースを作成します。

```sql
CREATE DATABASE eln_db;
```

### 2-2. （任意）専用ユーザーを作る場合

専用ユーザーを作る場合は以下を実行します。

```sql
CREATE USER eln_user WITH PASSWORD 'ここに任意のパスワード';
GRANT ALL PRIVILEGES ON DATABASE eln_db TO eln_user;
```

ここで決めた**ユーザー名とパスワードを手順③の `.env` に書きます**。

---

## ③ バックエンドのセットアップ（`eln_db/`）

### 3-1. Python依存パッケージをインストール

ルートディレクトリで以下を実行します

```powershell
uv sync
```

これにより、`pyproject.toml` / `uv.lock` に従ってpythonの仮想環境が作成され、必要なライブラリが一括で自動でインストールされます。

### 3-2. 接続情報（`.env`）を作成

`eln_db/.env.example`をもとに手順②で決めたユーザ名・パスワードを書き、ファイル名を`.env`に変換します。

```dotenv
SQL_USERNAME = ここにユーザ名
SQL_PASSWORD = ここにパスワード
```

### 3-4. テーブルを作成

`eln_db/` ディレクトリへ移動し、以下を実行するします。

```powershell
cd eln_db
uv run alembic upgrade head
```

これにより、 `compounds` / `reactions` / `reaction_components` の3テーブルが `eln_db` に作成されます。

> 確認: `uv run alembic current` で現在のリビジョンが表示されればOK。

### 3-5. バックエンドAPIサーバを起動

`eln_db/` ディレクトリで以下を実行します。

```powershell
uv run uvicorn main:app --reload
```

> - 既定で `http://127.0.0.1:8000` で起動します。
> - 動作確認: ブラウザで `http://127.0.0.1:8000/docs` を開くと、FastAPIの自動APIドキュメント（Swagger UI）が表示されます。
> - ターミナルで以下を実行し、OKが返ってきたら動作はOKです。
> ```powershell
> curl http://127.0.0.1:8000/health
> ```

---

## ④ フロントエンドのセットアップ（`eln_frontend/`）

別のターミナルを開き、`eln_frontend/` ディレクトリで以下を実行します。

```powershell
cd eln_frontend
npm install      # package.json に従い依存をインストール
npm run dev      # 開発サーバを起動
```

- 開発サーバは `http://localhost:5173` で起動します。
- **バックエンド（手順③）が起動していないとデータを取得できない**ので、両方を同時に起動しておくようにしてください。

---

## ⑤ 起動の全体像（2回目以降の日常起動）

一度セットアップが済めば、日常的に動かすのは次の2つのターミナルです。

```powershell
# ターミナル1: バックエンド
cd eln_db
uv run uvicorn main:app --reload

# ターミナル2: フロントエンド
cd eln_frontend
npm run dev
```

その上でブラウザで `http://localhost:5173` を開いてください。

---

## トラブルシューティング

| 症状                                                   | 原因と対処                                                                                            |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `alembic: not recognized` / `Failed to spawn: alembic` | 仮想環境の外で叩いている。`uv run alembic ...` の形で実行する（`uv sync` で導入済み）。 |
| `alembic ...` が「設定ファイルが無い」と言う           | 実行場所が違う。`alembic.ini` のある `eln_db/` で実行する。                                           |
| 起動時に `connection refused` / 認証エラー             | PostgreSQLが起動していない、または `.env` のユーザー名/パスワードが違う。手順②③を確認。               |
| `database "eln_db" does not exist`                     | DB未作成。手順2-1の `CREATE DATABASE eln_db;` を実行。                                                |
| `import` 直後にDB接続エラーで全コマンドが落ちる        | `database.py` がimport時に接続するため。DBと`.env`を先に整える（手順3-3参照）。                       |
| フロントに化合物が表示されない                         | バックエンドが未起動、またはCORS。まず手順③のサーバが起動しているか確認。                             |

---
