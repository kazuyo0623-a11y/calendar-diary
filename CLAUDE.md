# CLAUDE.md

このファイルは、リポジトリで作業する Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

```bash
npm run dev       # 開発サーバー起動（Vite HMR）
npm run build     # 型チェック（tsc -b）後にバンドル
npm run lint      # 全 .ts/.tsx ファイルに ESLint を実行
npm run preview   # プロダクションビルドをローカルで確認
npx tsc --noEmit  # 型チェックのみ（ファイル出力なし）
```

テストは未設定です。

## アーキテクチャ

**フロントエンドのみの SPA**（バックエンド・API 通信なし）。全データは `localStorage` のキー `calendar-diary-entries` に永続化されます。

### データフロー

```
localStorage
    ↕（マウント時に読み込み、状態変化のたびに書き込み）
useDiaries  (src/hooks/useDiaries.ts)
    ↓ 公開: entries, getByDate, getDatesWithEntries, saveEntry, deleteEntry, searchEntries
App.tsx  （UI 状態を一元管理: selectedDate, month/year, searchQuery, 表示モード）
    ↓ props で各コンポーネントへ渡す
Calendar / DiaryEditor / DiaryCard / SearchBar / MoodSelector / TagInput
```

### 重要な設計方針

- **1日1エントリ** — `saveEntry` は `date`（YYYY-MM-DD）をキーに upsert する。同じ日を編集すると新規作成ではなく上書き更新になる。
- **`date` が論理的な主キー**。`id`（UUID）は React の `key` prop や将来の拡張用に存在する。
- 共有型はすべて `src/types.ts` に集約：`DiaryEntry`・`MoodType`・`MOODS`（絵文字・ラベル・TailwindCSS カラークラスのメタデータマップ）。
- `App.tsx` が UI 状態（選択日付・カレンダー月・検索クエリ・エディター/一覧の切替）の唯一の管理元。外部状態ライブラリは使用していない。
- TailwindCSS v4 は `@tailwindcss/vite` プラグイン経由で統合されており、`tailwind.config.*` ファイルは存在しない。設定は `vite.config.ts` 内で完結する。

### TypeScript の厳格設定

`tsconfig.app.json` で `noUnusedLocals`・`noUnusedParameters`・`erasableSyntaxOnly` を有効化しています。未使用のインポートや引数はエラーになります。また `const enum` のような消去不可能な TypeScript 構文は使用しないでください。
