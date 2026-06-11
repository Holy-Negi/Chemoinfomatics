# eln_frontend

[Chemoinfomatics](../README.md) プロジェクトのフロントエンド。React 19 + Vite 製で、バックエンド（`eln_db`）の REST API を叩いて化合物・反応のデータを画面に表示する。

## 役割

バックエンドの `/compounds` を `fetch` で取得し、化合物の一覧（ID・名前・分子量）を表で表示する。データの計算・保存はすべてバックエンド側が担当し、フロントエンドは **表示専用** の役割を持つ。

## ディレクトリ構成

```
eln_frontend/
├── index.html         エントリ。<div id="root"> に React を描画
├── src/
│   ├── main.jsx       React アプリの起点（ReactDOM で root に描画）
│   ├── App.jsx        化合物一覧コンポーネント（API取得 → 表表示）
│   ├── App.css        App 用スタイル
│   ├── index.css      全体スタイル
│   └── assets/        画像（ロゴ等）
├── vite.config.js     Vite の設定
├── eslint.config.js   ESLint（静的解析）の設定
└── package.json       依存パッケージとスクリプト定義
```

## セットアップと起動

```bash
npm install      # 依存パッケージのインストール（初回のみ）
npm run dev      # 開発サーバ起動 → http://localhost:5173
```

その他のコマンド:

| コマンド | 内容 |
|----------|------|
| `npm run build` | 本番用にビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run lint` | ESLint でコードチェック |

## バックエンドとの連携

API のベース URL は `http://localhost:8000`（`eln_db` の FastAPI サーバ）。
表示には事前にバックエンドの起動が必要:

```bash
# eln_db/ ディレクトリで
uvicorn main:app --reload
```

バックエンド側は CORS でこの開発サーバ（`http://localhost:5173`）からのアクセスを許可している。

## 技術スタック

- **React 19** — UI ライブラリ
- **Vite** — 開発サーバ / ビルドツール（高速な HMR：ホットリロード）
- **React Compiler** — レンダリング最適化（本テンプレートで有効化済み）
- **ESLint** — 静的解析
