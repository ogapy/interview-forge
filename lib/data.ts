export const CATEGORY_LIST = [
  { key: "WebBasics", name: "Web基礎", desc: "HTTP, HTML, CSS, JS" },
  { key: "HTTP", name: "HTTP/REST API", desc: "ステータス/設計/セキュリティ" },
  { key: "Frontend", name: "React/Frontend", desc: "React, 状態管理, 最適化" },
  { key: "Backend", name: "Backend/Database", desc: "API設計, SQL/NoSQL" },
  { key: "SystemDesign", name: "System Design", desc: "スケーラビリティ/可用性" },
  { key: "DevOps", name: "DevOps/SRE", desc: "CI/CD, 監視, インフラ" },
]

export type Difficulty = "Easy" | "Medium" | "Hard"

export type Question = {
  id: string
  title: string
  content: string // markdown
  category: string
  difficulty: Difficulty
}

const SAMPLE_CONTENT = {
  WebBasics: `### 質問
ブラウザがURLを入力してからページを表示するまでの流れを、できるだけ具体的に説明してください。

- DNS解決
- TCP/TLSハンドシェイク
- HTTPリクエスト/レスポンス
- レンダリングパイプライン
`,
  HTTP: `### 質問
REST APIの設計原則について、リソース設計とHTTPメソッドの使い分けを含めて解説してください。
`,
  Frontend: `### 質問
Reactの再レンダー最適化手法（memo, useMemo, useCallback等）を、具体例を交えて説明してください。
`,
  Backend: `### 質問
データベースのインデックスとは何か、仕組みと注意点を説明してください。`,
  SystemDesign: `### 質問
URL短縮サービスを設計してください。考慮点（スケーラビリティ、整合性、可用性など）も述べてください。`,
  DevOps: `### 質問
Blue-GreenデプロイとCanaryリリースの違いを説明し、適切な適用シナリオを述べてください。`,
}

export function generateQuestion(category: string, difficulty: Difficulty): Question {
  const id = crypto.randomUUID()
  const base = SAMPLE_CONTENT[category as keyof typeof SAMPLE_CONTENT] ?? SAMPLE_CONTENT.WebBasics
  const title = `${category}の質問 (${difficulty})`
  const content = base + `\n> 難易度: ${difficulty}\n`
  return { id, title, content, category, difficulty }
}

// Very simple follow-up generator for interview mode
export function generateFollowUp(prev: string): string {
  const len = prev.length
  if (len < 60) return "もう少し具体例を交えて説明できますか？トレードオフも含めて話してください。"
  if (prev.toLowerCase().includes("cache")) return "キャッシュの失効戦略と一貫性の取り扱いについてはどう考えますか？"
  if (prev.toLowerCase().includes("index")) return "なぜB+木がよく使われるのか、他のデータ構造との比較をお願いします。"
  return "要点を箇条書きで整理し、優先順位を付けるとしたらどうしますか？"
}
