# 技術スタック

## 🎨 フロントエンドフレームワーク

### Next.js 15.2.4
- **App Router** を採用した最新のアーキテクチャ
- サーバーサイドレンダリング（SSR）対応
- 自動的なコード分割と最適化
- 画像最適化機能

### React 19
- 最新の React バージョンを使用
- Concurrent Features による高速なUI更新
- Server Components 対応

### TypeScript 5
- 型安全な開発環境
- **strict モード** 有効で堅牢なコード
- 最新の TypeScript 機能を活用

## 💅 スタイリング・UI

### Tailwind CSS 4.1.9
- ユーティリティファーストアプローチ
- JIT（Just-In-Time）コンパイル
- カスタマイズ可能なデザインシステム
- レスポンシブデザインの簡単な実装

### shadcn/ui
- **Radix UI** ベースのアクセシブルなコンポーネント
- カスタマイズ可能なコンポーネントライブラリ
- コピー&ペースト可能な実装
- ダークモード対応

### アイコン・フォント
- **lucide-react**: 美しいオープンソースアイコン
- **geist**: Vercel 製のモダンなフォント

## 📊 状態管理・データ処理

### Zustand
- シンプルで軽量な状態管理
- TypeScript との優れた統合
- Redux よりも少ないボイラープレート
- パフォーマンスの最適化

### React Hook Form
- 高性能なフォーム管理
- 再レンダリングの最小化
- バリデーション統合

### Zod 3.25.67
- TypeScript ファーストのスキーマ検証
- ランタイム型チェック
- React Hook Form との完璧な統合

## 📈 データビジュアライゼーション

### Chart.js & react-chartjs-2
- 豊富なチャートタイプ
- インタラクティブなグラフ
- カスタマイズ可能なデザイン

### Recharts 2.15.4
- React 専用のチャートライブラリ
- 宣言的なAPI
- レスポンシブ対応

## 🔧 開発ツール

### パッケージマネージャー
- **pnpm**: 高速で効率的な依存関係管理
- ディスクスペースの節約
- 厳密な依存関係管理

### ビルドツール
- **PostCSS**: CSS の変換と最適化
- **Autoprefixer**: ベンダープレフィックスの自動追加

## 🎯 その他の主要ライブラリ

### ユーティリティ
- **clsx**: 条件付きクラス名の結合
- **tailwind-merge**: Tailwind クラスの競合解決
- **date-fns**: 日付操作ユーティリティ

### UI/UX 向上
- **next-themes**: ダークモード実装
- **sonner**: エレガントなトースト通知
- **cmdk**: コマンドメニュー実装
- **vaul**: モバイル向けドロワー

### エディタ
- **@uiw/react-md-editor**: Markdown エディタ
- **@uiw/react-markdown-preview**: Markdown プレビュー

### アニメーション
- **tailwindcss-animate**: Tailwind ベースのアニメーション
- **embla-carousel-react**: 高性能カルーセル

## 📦 依存関係のバージョン管理
- `latest` タグを使用している一部のパッケージは、本番環境では固定バージョンに変更推奨
- 定期的な依存関係の更新とセキュリティチェックが必要