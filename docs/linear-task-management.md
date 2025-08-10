# Linear タスク管理ガイド

## 📋 概要

このドキュメントでは、Linear MCP を使用した Interview Forge プロジェクトのタスク管理方法について説明します。

## 🎯 タスク作成のルール

### 基本設定

Linear でタスクを作成する際は、以下の設定を使用してください：

| 項目 | 設定値 |
|------|--------|
| **チーム** | InterviewForge |
| **プロジェクト** | ユーザーの指示に従って選択 |
| **初期ステータス** | Todo |
| **優先度** | ユーザー指定がない限り設定しない |

### タスクの記述フォーマット

すべてのタスクには **Why（なぜ）**、**How（どのように）**、**Goal（ゴール）** の3つの要素を必ず含めてください。

#### 📝 タスクタイトル

簡潔で分かりやすいタイトルを設定します。
- 動詞から始める（例：「実装する」「修正する」「追加する」）
- 具体的な機能や対象を明記する

#### 📄 タスク説明文のテンプレート

```markdown
## Why（なぜこのタスクが必要か）

- このタスクを実行する背景や理由
- 解決しようとしている問題
- ビジネス価値や技術的な必要性

## How（どのようにタスクを実行するか）

### 実装手順
1. [ステップ1の詳細]
2. [ステップ2の詳細]
3. [ステップ3の詳細]

### 技術的な詳細
- 使用する技術やフレームワーク
- 依存関係や前提条件
- 参考となるドキュメントやリソース

## Goal（タスクのゴール）

### 完了条件
- [ ] [具体的な完了条件1]
- [ ] [具体的な完了条件2]
- [ ] [具体的な完了条件3]

### 期待される成果物
- [成果物1の説明]
- [成果物2の説明]

### 検証方法
- [動作確認の方法]
- [テスト方法]
```

## 🌿 Git ブランチ運用

### ブランチ命名規則

Linear の Issue ID を必ずブランチ名の冒頭に含めてください。

**フォーマット**: `[LinearIssueID]/[機能や修正内容の説明]`

#### ブランチタイプ別の例

| タイプ | 例 | 用途 |
|--------|-----|------|
| 機能追加 | `IF-123/add-user-authentication` | 新機能の実装 |
| バグ修正 | `IF-456/fix-database-connection` | バグの修正 |
| リファクタリング | `IF-789/refactor-api-structure` | コードの改善 |
| ドキュメント | `IF-234/update-api-documentation` | ドキュメントの更新 |

### コミットメッセージ

コミットメッセージには Linear Issue ID を含めることを推奨します。

**フォーマット**: `[LinearIssueID]: [変更内容の説明]`

**例**:
```bash
git commit -m "IF-123: ユーザー認証機能のバックエンドAPIを実装"
git commit -m "IF-456: データベース接続エラーの修正"
git commit -m "IF-789: APIルーティングのリファクタリング"
```

## 📊 タスクのステータス管理

### ステータスの種類と使い方

| ステータス | 説明 | 使用タイミング |
|------------|------|----------------|
| **Todo** | 未着手のタスク | タスク作成時の初期状態 |
| **In Progress** | 作業中のタスク | 開発を開始した時点 |
| **In Review** | レビュー中 | PR を作成した時点 |
| **Done** | 完了 | PR がマージされた時点 |
| **Canceled** | キャンセル | タスクが不要になった場合 |

## 🔄 ワークフロー

### 1. タスク作成
```bash
# Claude Code でタスクを作成
# 例: "Linear で新しいタスクを作成してください。ユーザー認証機能の実装です。"
```

### 2. ブランチ作成
```bash
# Linear Issue ID を使用してブランチを作成
git checkout -b IF-123/add-user-authentication
```

### 3. 開発作業
```bash
# 開発を進める
pnpm dev

# コミット（Linear Issue ID を含める）
git add .
git commit -m "IF-123: 認証ミドルウェアを実装"
```

### 4. プルリクエスト作成
```bash
# PR のタイトルと説明に Linear Issue ID を含める
# タイトル例: "IF-123: ユーザー認証機能の実装"
```

### 5. タスクのクローズ
- PR がマージされたら、Linear のタスクを「Done」に更新

## 💡 ベストプラクティス

### タスクの粒度
- 1つのタスクは 1〜3日で完了できる規模に分割
- 大きな機能は複数のサブタスクに分解
- 各タスクは独立してテスト可能な単位

### ラベルの活用
- `bug`: バグ修正
- `feature`: 新機能
- `enhancement`: 機能改善
- `documentation`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト関連

### 優先度の設定
- **Urgent (1)**: 即座に対応が必要
- **High (2)**: 重要度が高い
- **Normal (3)**: 通常の優先度
- **Low (4)**: 優先度が低い

## 🔗 関連ドキュメント

- [Git/GitHub 運用](./git-workflow.md)
- [開発コマンド](./development-commands.md)
- [プロジェクト概要](./project-overview.md)

## 📚 参考リソース

- [Linear Documentation](https://linear.app/docs)
- [Linear API Reference](https://developers.linear.app/docs/graphql/working-with-the-graphql-schema)
- [Git Flow Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)