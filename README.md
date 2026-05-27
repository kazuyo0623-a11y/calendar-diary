# 📔 カレンダー日記

React + TypeScript + Vite + TailwindCSS で作ったカレンダー付き日記アプリです。

## 機能

- 📅 月間カレンダー（日記がある日・気分を絵文字でハイライト）
- ✍️ 日記の作成・編集・削除（2段階確認）
- 😊 気分記録（5段階：最高 / いい感じ / ふつう / つらい / ひどい）
- 🏷️ タグ機能（Enter / スペース / カンマで追加、Backspace で削除）
- 🔍 タイトル・本文・タグのリアルタイム検索
- 💾 データは localStorage に自動保存（サーバー不要）

## セットアップ

```bash
npm install
npm run dev
```

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLint
npm run preview  # ビルド結果を確認
```

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React 19 + TypeScript |
| ビルドツール | Vite 8 |
| スタイリング | TailwindCSS v4 |
| データ永続化 | localStorage |
