# Claude Code プロジェクトガイド

## 📚 プロジェクトドキュメント

以下のドキュメントを参照してプロジェクトを理解してください：

- 📄 [プロジェクト概要](../docs/project-overview.md) - Interview Forge の目的と主要機能
- 🛠️ [技術スタック](../docs/tech-stack.md) - 使用している技術とライブラリ
- 📁 [プロジェクト構造](../docs/project-structure.md) - ディレクトリ構成とアーキテクチャ
- ⚡ [開発コマンド](../docs/development-commands.md) - よく使うコマンドとツール
- 🌊 [Git/GitHub 運用](../docs/git-workflow.md) - GitHub Flow とベストプラクティス

## 🎯 このプロジェクトについて

**Interview Forge** は、技術面接の準備を AI でサポートする Web アプリケーションです。

### 主な技術
- **Next.js 15.2.4** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui**
- **Zustand** (状態管理)
- **pnpm** (パッケージマネージャー)

## ⚠️ 重要な注意事項

### 現在の設定
- **ESLint**: `ignoreDuringBuilds: true` - ビルド時のエラーは無視される
- **TypeScript**: `ignoreBuildErrors: true` - ビルド時のエラーは無視される
- これらは開発速度優先の一時的な設定です。コード品質のため、手動でのチェックを推奨します。

### 開発時の確認コマンド
```bash
# TypeScript の型チェック
pnpm tsc --noEmit

# ESLint の実行
pnpm lint
```

## 📋 Claude Code 専用リソース

このディレクトリ内の以下のファイルは Claude Code の開発支援用です：

- 📝 [開発チェックリスト](./development-checklist.md) - 機能実装やバグ修正時の確認事項
- 🎨 [コンポーネントパターン](./component-patterns.md) - よく使うコンポーネントのコード例
- ⚡ [クイックリファレンス](./quick-reference.md) - 頻繁に参照する情報のまとめ

## 🚀 開発フロー

1. **要件理解**: ユーザーの要求を正確に理解
2. **既存コード確認**: 関連するファイルと構造を確認
3. **実装**: TypeScript の型安全性を保ちながら実装
4. **動作確認**: `pnpm dev` で動作を確認
5. **品質チェック**: TypeScript と ESLint のエラーを確認

## 💡 ベストプラクティス

### コーディング規約
- ✅ 関数コンポーネントを使用
- ✅ TypeScript の `any` 型は使用禁止
- ✅ `@/` エイリアスでインポート
- ✅ shadcn/ui コンポーネントを優先的に使用
- ✅ 日本語 UI テキスト

### Git コミット
- 機能単位での細かいコミット
- 明確なコミットメッセージ（日本語可）
- 不要なファイルを含めない

Git/GitHub 運用については、以下のドキュメントを参照してください：
- 🌊 [Git/GitHub 運用](../docs/git-workflow.md) - GitHub Flow とベストプラクティス

## 🔗 外部リンク

- **デプロイ URL**: https://vercel.com/ogapys-projects/v0-next-js-ui-design
- **v0.dev プロジェクト**: https://v0.dev/chat/projects/f9btuQLPXDz

## 📌 よく使うコマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 型チェック
pnpm tsc --noEmit

# リンター
pnpm lint

# 依存関係インストール
pnpm install
```
