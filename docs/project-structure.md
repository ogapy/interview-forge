# プロジェクト構造

## 📁 ディレクトリ構成

```
interview-forge/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 interview/         # 面接練習機能
│   │   └── page.tsx          # 面接練習ページ
│   ├── 📂 practice/          # 練習モード
│   │   ├── page.tsx          # 練習開始ページ
│   │   └── result/           # 結果表示
│   ├── 📂 review/            # レビュー機能
│   │   └── page.tsx          # レビューページ
│   ├── 📂 history/           # 履歴管理
│   │   └── page.tsx          # 履歴一覧ページ
│   ├── 📂 login/             # 認証
│   │   └── page.tsx          # ログイン/サインアップ
│   ├── layout.tsx            # ルートレイアウト
│   ├── page.tsx              # ホームページ
│   ├── globals.css           # グローバルスタイル
│   ├── error.tsx             # エラーページ
│   └── not-found.tsx         # 404ページ
│
├── 📂 components/            # UIコンポーネント
│   ├── 📂 ui/               # shadcn/ui コンポーネント
│   │   ├── button.tsx        # ボタン
│   │   ├── card.tsx          # カード
│   │   ├── dialog.tsx        # ダイアログ
│   │   ├── form.tsx          # フォーム
│   │   ├── input.tsx         # 入力フィールド
│   │   └── ...               # その他のUIコンポーネント
│   ├── header.tsx            # ヘッダーコンポーネント
│   └── ...                   # その他のコンポーネント
│
├── 📂 lib/                   # ユーティリティ
│   └── utils.ts              # 共通ユーティリティ関数
│
├── 📂 store/                 # 状態管理（Zustand）
│   ├── auth.ts               # 認証ストア
│   ├── practice.ts           # 練習データストア
│   └── ...                   # その他のストア
│
├── 📂 hooks/                 # カスタムフック
│   └── ...                   # 各種カスタムフック
│
├── 📂 styles/                # スタイルファイル
│   └── ...                   # 追加のスタイル
│
├── 📂 public/                # 静的ファイル
│   └── ...                   # 画像、フォントなど
│
├── 📂 docs/                  # ドキュメント
│   ├── project-overview.md   # プロジェクト概要
│   ├── tech-stack.md         # 技術スタック
│   ├── project-structure.md  # このファイル
│   └── ...                   # その他のドキュメント
│
├── 📂 .claude/               # Claude Code 設定
│   ├── CLAUDE.md             # Claude Code 用ガイド
│   └── ...                   # 開発支援ファイル
│
└── 📄 設定ファイル
    ├── package.json          # 依存関係とスクリプト
    ├── tsconfig.json         # TypeScript設定
    ├── next.config.mjs       # Next.js設定
    ├── tailwind.config.ts    # Tailwind CSS設定
    ├── postcss.config.mjs    # PostCSS設定
    ├── components.json       # shadcn/ui設定
    └── .gitignore           # Git除外設定
```

## 🏗️ アーキテクチャの特徴

### App Router (Next.js 15)
- **ファイルベースルーティング**: ディレクトリ構造がそのままURLパスに対応
- **レイアウトの入れ子**: 共通レイアウトの効率的な管理
- **Server Components**: デフォルトでサーバーサイドレンダリング
- **Client Components**: `"use client"` ディレクティブで明示的に指定

### コンポーネント設計
- **UI コンポーネント**: `components/ui/` に汎用的なUIパーツを配置
- **機能コンポーネント**: 各ページ固有のコンポーネントは該当ディレクトリ内に配置
- **shadcn/ui**: コピー&ペースト型のコンポーネントライブラリを採用

### 状態管理
- **Zustand ストア**: `store/` ディレクトリで集中管理
- **ローカル状態**: React の useState/useReducer を活用
- **サーバー状態**: 必要に応じて React Query などを検討

## 📝 ファイル命名規則

### TypeScript/JavaScript
- **コンポーネント**: PascalCase（例: `Button.tsx`, `UserProfile.tsx`）
- **ユーティリティ**: camelCase（例: `utils.ts`, `formatDate.ts`）
- **型定義**: PascalCase（例: `User.ts`, `ApiResponse.ts`）

### スタイル
- **CSS モジュール**: camelCase（例: `styles.module.css`）
- **グローバルCSS**: kebab-case（例: `globals.css`）

## 🔧 インポートパス

### エイリアス設定
```typescript
// tsconfig.json で設定済み
"@/*": ["./*"]
```

### 使用例
```typescript
// 推奨: 絶対パス
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth"
import { formatDate } from "@/lib/utils"

// 非推奨: 相対パス
import { Button } from "../../components/ui/button"
```

## 🎯 各ディレクトリの役割

### `/app`
- ページとルーティングを管理
- 各ページのメタデータと SEO 設定
- エラーハンドリングとローディング状態

### `/components`
- 再利用可能な UI コンポーネント
- ビジネスロジックを含まない純粋な表示コンポーネント

### `/lib`
- 汎用的なユーティリティ関数
- 外部ライブラリのラッパー
- 定数定義

### `/store`
- グローバル状態管理
- 永続化が必要なデータ
- アプリケーション全体で共有するデータ

### `/hooks`
- カスタムフック
- ロジックの再利用
- コンポーネントからロジックを分離