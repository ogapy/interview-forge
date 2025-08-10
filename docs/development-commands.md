# 開発コマンドガイド

## 🚀 基本的な開発コマンド

### 開発サーバーの起動
```bash
pnpm dev
```
- ローカル開発サーバーを起動（デフォルト: http://localhost:3000）
- ホットリロード対応
- ファイル変更を自動検出して再コンパイル

### プロダクションビルド
```bash
pnpm build
```
- 本番環境用の最適化されたビルドを作成
- TypeScript のコンパイル
- バンドルサイズの最適化
- 静的ファイルの生成

### プロダクションサーバーの起動
```bash
pnpm start
```
- ビルド済みのアプリケーションを本番モードで起動
- `pnpm build` を事前に実行する必要あり

### リンターの実行
```bash
pnpm lint
```
- ESLint によるコード品質チェック
- Next.js 推奨のルールセット適用
- **注意**: 現在 `ignoreDuringBuilds: true` のため、手動実行推奨

## 📦 パッケージ管理

### 依存関係のインストール
```bash
pnpm install
# または
pnpm i
```
- `package.json` に記載された全ての依存関係をインストール
- `pnpm-lock.yaml` を使用して正確なバージョンを保証

### パッケージの追加
```bash
# 本番依存関係として追加
pnpm add [package-name]

# 開発依存関係として追加
pnpm add -D [package-name]
# または
pnpm add --save-dev [package-name]

# 特定バージョンを指定
pnpm add [package-name]@[version]
```

### パッケージの削除
```bash
pnpm remove [package-name]
# または
pnpm rm [package-name]
```

### パッケージの更新
```bash
# 全てのパッケージを更新
pnpm update

# 特定のパッケージを更新
pnpm update [package-name]

# 最新バージョンをチェック
pnpm outdated
```

## 🔧 Git 操作

### 基本的な Git コマンド
```bash
# 変更状況の確認
git status

# 差分の確認
git diff

# ステージング
git add .
git add [file-path]

# コミット
git commit -m "コミットメッセージ"

# プッシュ
git push origin main

# プル
git pull origin main
```

### ブランチ操作
```bash
# ブランチ一覧
git branch

# 新規ブランチ作成 & 切り替え
git checkout -b [branch-name]

# ブランチ切り替え
git checkout [branch-name]

# ブランチのマージ
git merge [branch-name]
```

### コミット履歴
```bash
# コミット履歴の確認
git log --oneline -10

# 詳細なログ
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'
```

## 🛠️ トラブルシューティング

### ポートが使用中の場合
```bash
# 3000番ポートを使用しているプロセスを確認（macOS/Linux）
lsof -i :3000

# プロセスを終了
kill -9 [PID]

# 別のポートで起動
PORT=3001 pnpm dev
```

### キャッシュのクリア
```bash
# Next.js のキャッシュをクリア
rm -rf .next

# node_modules の再インストール
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript エラーのチェック
```bash
# TypeScript のコンパイルチェック（ビルドなし）
pnpm tsc --noEmit

# 特定ファイルのチェック
pnpm tsc --noEmit [file-path]
```

## 📊 分析・デバッグ

### バンドルサイズの分析
```bash
# Next.js Bundle Analyzer（要追加設定）
ANALYZE=true pnpm build
```

### パフォーマンス測定
```bash
# Lighthouse CI（要インストール）
npx lighthouse http://localhost:3000
```

## 🔍 便利なシステムコマンド（macOS）

### ファイル・ディレクトリ操作
```bash
# ディレクトリ内容の確認
ls -la

# ツリー表示（要 tree インストール）
tree -L 2 -I 'node_modules|.next'

# ファイル検索
find . -name "*.tsx" -not -path "./node_modules/*"

# テキスト検索
grep -r "検索文字列" --exclude-dir=node_modules --exclude-dir=.next
```

### プロセス管理
```bash
# 実行中のNode.jsプロセス確認
ps aux | grep node

# メモリ使用量確認
top -o mem
```

## ⚡ 開発効率化のヒント

### エイリアスの設定（推奨）
```bash
# ~/.zshrc または ~/.bashrc に追加
alias pd="pnpm dev"
alias pb="pnpm build"
alias pi="pnpm install"
alias gs="git status"
alias gc="git commit -m"
```

### 並行実行
```bash
# 複数のコマンドを並行実行（要 concurrently）
pnpm add -D concurrently
npx concurrently "pnpm dev" "pnpm test:watch"
```

## 📝 注意事項

1. **pnpm を使用**: このプロジェクトは `pnpm` を使用しています。`npm` や `yarn` は使用しないでください
2. **ESLint/TypeScript エラー**: 現在ビルド時に無視する設定になっているため、手動でのチェックが重要
3. **環境変数**: `.env` ファイルは Git に含まれません。必要に応じて `.env.example` を参考に作成してください