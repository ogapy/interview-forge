type Detail = {
  accuracy: number
  completeness: number
  logic: number
  terminology: number
  communication: number
}

type Feedback = {
  good: string[]
  improve: string[]
  resources: string[]
  byAspect: string[]
}

export function gradeAnswer(answer: string, question: string): { total: number; detail: Detail; feedback: Feedback } {
  const len = answer.trim().length
  const hasCode = /`{1,3}/.test(answer)
  const hasList = /(^|\n)[-*]\s/m.test(answer)
  const mentions = (kw: string) => new RegExp(kw, "i").test(answer)
  const base = Math.min(100, Math.max(30, Math.floor(len / 6)))

  const accuracy = clamp(base + (mentions("http") || mentions("tcp") ? 8 : 0))
  const completeness = clamp(base - 5 + (hasList ? 10 : 0))
  const logic = clamp(base + (mentions("because") || mentions("ため") ? 6 : 0))
  const terminology = clamp(base + (mentions("latency") || mentions("整合性") || mentions("index") ? 8 : 0))
  const communication = clamp(base + (hasCode ? 4 : 0))

  const detail: Detail = { accuracy, completeness, logic, terminology, communication }
  const total = clamp(Math.round((accuracy + completeness + logic + terminology + communication) / 5))

  const good: string[] = []
  if (hasList) good.push("箇条書きで整理されており読みやすいです。")
  if (hasCode) good.push("コード/記法を用いて具体性があります。")
  if (mentions("trade-off") || mentions("トレードオフ")) good.push("トレードオフを意識した説明ができています。")
  if (good.length === 0) good.push("要点を分かりやすく説明できています。")

  const improve: string[] = []
  if (len < 200) improve.push("もう少し具体例や詳細を加えましょう。")
  if (!hasList) improve.push("箇条書きで段階的に説明するとより明確です。")
  if (!mentions("結論") && !mentions("まとめ")) improve.push("結論ファーストを意識しましょう。")

  const resources = ["System Design Primer", "Google Web Fundamentals", "PostgreSQL公式ドキュメント - インデックス"]

  const byAspect = [
    "正確性: 事実関係の裏取りや用語の定義を明確にしましょう。",
    "網羅性: 前提・手順・例外など抜け漏れがないか確認を。",
    "論理構成: 結論→根拠→具体例の順に並べると伝わります。",
    "専門用語: 用語は定義と一緒に、かつ過不足なく使いましょう。",
    "表現: 箇条書きや図解を活用して視認性を高めましょう。",
  ]

  return { total, detail, feedback: { good, improve, resources, byAspect } }
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)))
}
