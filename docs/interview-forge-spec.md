# 面接対策アプリ 要件 & 技術選定（ドラフト）

## 0. 目的 / ゴール

* **主目的**：Web アプリ開発領域の技術面接で「質問に答えられる力」を効率的に伸ばす
* **手段**：LLMで質問生成 → 記述式で回答 → LLMで採点/フィードバック → 履歴/復習で定着
* **副次効果**：モダン技術スタックの実戦投入（LLM/PromptOps/Observability/DevOps）

---

## 1. スコープ & ユーザー

* 当面は**個人利用**（将来の公開を見据えてマルチテナント対応しやすい設計）
* 出題領域：**Webアプリ全般**（将来拡張でフロント/バック/インフラ/データエンジニアなどカテゴリ追加）

---

## 2. ユースケース / フロー

1. カテゴリ/難易度を選ぶ（もしくは「おまかせ」）
2. **問題を提示**（LLM生成 or 既存ストックから供給）
3. ユーザーが**記述式で回答**（Markdown）
4. **LLMが採点/講評**（総合スコア＋観点別スコア＋改善点＋再学習ポイント）
5. **履歴保存**／「要復習」に追加
6. 復習画面で再挑戦（任意タイミング、将来は間隔学習）

---

## 3. 機能要件（MVP）

* **問題生成**：カテゴリ/難易度/テーマを入力してLLM生成（メタデータ付きで永続化）
* **記述回答UI**：Markdown入力、タイマー（任意）
* **自動添削**：Rubricに沿った採点（例：正確さ・網羅性・深掘り・構成・用語）
* **履歴管理**：スコア推移、カテゴリ別弱点、回答と講評の保存
* **再出題/復習**：任意タイミングで再挑戦（★将来：SM-2/Leitner）
* **リアルタイム面接モード（初期β）**：テキストで追い質問を自動生成、短時間QA

---

## 4. 非機能要件

* **パフォーマンス**：生成/添削は体感10秒以内を目標（事前生成キャッシュで平準化）
* **再現性**：temperature/seed/プロンプトIDを保存（再実験可能）
* **セキュリティ**：API Keyはサーバ側保管、監査ログ、PII最小化
* **コスト管理**：1回答あたりコストの可視化、上限ガード
* **多言語**：日本語/英語の出題・回答に対応（将来）

---

## 5. 問題供給戦略（生成 vs ストック）

* 推奨：**オンデマンド生成＋キャッシュ再利用**のハイブリッド

  * 初回：LLM生成 → **Problems** に保存
  * 2回目以降：まずDBから出題、在庫不足時のみ生成
  * オプション：**バッチ事前生成**でカテゴリ毎に在庫を補充

---

## 6. データモデル（最小）

```sql
-- ユーザー（将来の公開を見据えて）
table users (
  id             text primary key,
  github_id      text,          -- 任意（GitHubログイン時）
  name           text,
  created_at     timestamptz default now()
);

-- 問題ストック
table problems (
  id             text primary key,
  category       text,          -- ex) web-basics, http, react, api-design, sre...
  difficulty     text,          -- easy/medium/hard
  title          text,
  body_md        text,          -- 問題本文（Markdown）
  tags           text[],        -- ["REST","HTTP"]
  source         text,          -- "llm"|"manual"
  prompt_id      text,          -- 生成に使ったプロンプトバージョン
  seed           int,
  first_seen_at  timestamptz default now()
);

-- 回答 & 添削結果
table answers (
  id               text primary key,
  user_id          text references users(id),
  problem_id       text references problems(id),
  answer_md        text,
  created_at       timestamptz default now(),
  score_total      numeric,     -- 0-5など
  score_detail     jsonb,       -- {"accuracy":4,"coverage":3,"depth":2,"structure":3}
  feedback_md      text,        -- 講評
  reviewer_model   text,        -- モデル名
  review_prompt_id text,
  latency_ms       int,
  cost_usd         numeric
);

-- 復習キュー（任意→将来SM-2に拡張）
table review_queue (
  id             text primary key,
  user_id        text references users(id),
  problem_id     text references problems(id),
  flagged        boolean default true,
  due_at         timestamptz,
  ease_factor    numeric,   -- 将来用
  interval_days  int,       -- 将来用
  repetition     int        -- 将来用
);

-- プロンプトバージョン管理（PromptOps）
table prompts (
  id          text primary key,   -- "qa_gen_v1.0"
  kind        text,               -- "generate"|"review"|"followup"
  body        text,               -- テンプレ本文（md/yaml混在OK）
  params_yaml text,               -- temperature, max_tokens など
  created_at  timestamptz default now()
);
```

> 将来「似た問題検索」やRAGをやるなら **pgvector**（問題/回答の埋め込みベクトル）を追加。

---

## 7. アーキテクチャ（概略）

```
[Next.js (App Router)]
   ├─ Server Actions / tRPC → [BFF] → [LLM API]  ←→ [Langfuse (観測)]
   ├─ 認証(GitHub OAuth 任意)
   └─ UI: 問題 → 回答 → 採点結果 → 復習

[DB: Postgres (+pgvector)]
   ├─ problems / answers / prompts / review_queue / users
   └─ メトリクス: cost/latency/score を蓄積
```

* **リアルタイム面接**：ストリーミング応答（Server Actionsのstream / tRPC subscriptions）

---

## 8. 技術選定（推奨プラン）

### 8.1 オール TypeScript（最速で“モダン”を味わう軸）

* **フロント**：Next.js（App Router / Server Actions）、React（最新版）、shadcn/ui、Tailwind
* **BFF/RPC**：tRPC（完全型安全・WS対応）
* **ORM/DB**：Prisma + PostgreSQL（将来 pgvector）
* **ランタイム/ツール**：Bun（高速 dev/test）、ESBuild or SWC
* **LLM/PromptOps**：LangChain or OpenAI SDK 直 & **Langfuse**（トレース/評価/AB）
* **デプロイ**：Vercel（Preview Deploy）、DBはRailway/Neon/Turso等
* **監視**：OpenTelemetry → Grafana Cloud / Langfuse のトレース

### 8.2 バックエンド差し替え（学習拡張オプション）

* **Rust**：axum + sqlx/SeaORM（高性能・型安全）
* **Python**：FastAPI + SQLModel/Tortoise（LLMエコシステムが豊富）
* **Go**：Gin/Echo + sqlc/pgx（単一バイナリで運用簡単）

> API 契約（tRPC/REST/OpenAPI）を固定して BFF を言語別に差し替えて比較学習。

### 8.3 認証/公開

* **GitHub OAuth**（Nice to have。ポートフォリオ映え）
* マルチテナントは `user_id` 列で拡張

---

## 9. PromptOps 設計

* **バージョニング**：`prompts/qa_gen_v1.md`, `review_v1.md` などをGit管理
* **パラメタ化**：YAML Front Matterで `temperature/seed/max_tokens`
* **計測**：Langfuseで *cost/latency/score* をトレース、プロンプトID別にメトリクス比較
* **ABテスト**：同一問題に対し複数プロンプトで採点→統計比較
* **再現性**：回答・採点に使った *prompt\_id / model / seed* を **answers** に保存

---

## 10. リアルタイム面接モード（実装案）

* **開始**：カテゴリを選ぶ → タイマー開始（30/60秒）
* **進行**：ユーザー回答→ LLMが**追い質問**（低スコア観点を深掘り）
* **技術**：tRPC subscriptions / Server Actions streaming、フロントはToast/Timer
* **記録**：一連のQAを1セッションとして保存（質疑ログ、観点別変化）

---

## 11. 学習/復習ロジック

* MVP：**手動復習**（「要復習」に入れた問題をいつでも再挑戦）
* 将来：**SM-2**（`ease_factor/interval/repetition`で間隔学習）
* 可視化：カテゴリ別平均スコア、7/30日トレンド、弱点タグの推移

---

## 12. コスト/運用ポリシー

* 1 回答あたり **トークン使用量とコスト**を保存
* **月上限**を設定（超えたらオンデマンド生成→ストック優先に切り替え）
* バッチ事前生成は**夜間に低頻度**、在庫閾値（例：各カテゴリ20問）を下回ったら補充

---

## 13. ロードマップ（最短ルート）

1. **Next.js + Bun で雛形**／DB接続（Postgres/Prisma）
2. **プロンプト v0.1**（出題・添削）＋ Langfuse 連携
3. **スキーマ実装**（problems/answers/prompts/review\_queue）
4. **MVP 画面**（出題→回答→採点→履歴/復習）
5. **リアルタイム面接 β**（テキスト追い質問）
6. 公開（GitHub OAuth 追加、軽い利用規約/プライバシー表示）

---

## 14. 発展アイデア

* **SREネタ**：OpenTelemetry徹底、Canary/Traffic Split、エラーバジェット
* **データエンジニア拡張**：ETL/モデリング設計の設問セット、RAGで社内用語集（将来）
* **レコメンド**：弱点タグ × 近傍検索（pgvector）で「次に解くべき問題」を提示

---

## 15. 未決定事項 / リスク

* 利用する **LLMモデル**の確定（品質/コスト/速度の折衷）
* **バッチ生成**の在庫閾値・失敗時リトライ方針
* 公開時の**利用規約/免責**（生成物の注意書き）

---

### 付録：採点Rubric（例）

* **Accuracy/正確さ**（0-5）
* **Coverage/網羅性**（0-5）
* **Depth/深掘り**（0-5）
* **Structure/構成力**（0-5）
* **Terminology/用語の正確さ**（0-5）
  → 合計スコアと、改善点・参考キーワードを講評に含める

---

**このドラフトをベースに、項目ごとに“確定/保留”を印つけていけば、すぐ実装に移れます。必要ならこのままリポジトリの README.md に貼り付けてスタートしましょう。**
