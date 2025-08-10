"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScoreDisplay } from "@/components/score-display"
import { RadarChart } from "@/components/radar-chart"
import Link from "next/link"
import { usePracticeStore } from "@/store/use-practice-store"
import { useEffect, useMemo } from "react"
import { gradeAnswer } from "@/lib/scoring"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const { draft, currentQuestion, selection, addHistory, clearDraft } = usePracticeStore()

  useEffect(() => {
    if (!currentQuestion || !selection.category) {
      router.replace("/practice")
    }
  }, [currentQuestion, selection, router])

  const result = useMemo(() => {
    const answer = draft || ""
    const graded = currentQuestion ? gradeAnswer(answer, currentQuestion.content) : null
    if (graded && currentQuestion) {
      // Record history once on mount
      addHistory({
        category: selection.category,
        difficulty: selection.difficulty,
        title: currentQuestion.title,
        totalScore: graded.total,
        detail: graded.detail,
        feedback: graded.feedback,
      })
      clearDraft()
    }
    return graded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!currentQuestion || !result) {
    return null
  }

  const labels = ["正確性", "網羅性", "論理構成", "用語", "表現"]
  const data = [
    result.detail.accuracy,
    result.detail.completeness,
    result.detail.logic,
    result.detail.terminology,
    result.detail.communication,
  ]

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge>{selection.category}</Badge>
          <Badge variant="secondary">{selection.difficulty}</Badge>
          <span className="text-sm text-muted-foreground">採点結果</span>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <Card className="flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>スコアサマリー</CardTitle>
              <CardDescription>総合評価（100点満点）</CardDescription>
            </CardHeader>
            <CardContent>
              <ScoreDisplay score={result.total} label="Total Score" />
            </CardContent>
            <CardFooter className="flex gap-2">
              <Badge variant={result.total >= 80 ? "success" : result.total >= 60 ? "warning" : "destructive"}>
                {result.total >= 80 ? "Excellent" : result.total >= 60 ? "Good" : "Needs Work"}
              </Badge>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>観点別スコア</CardTitle>
              <CardDescription>弱点を把握しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={data} labels={labels} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>詳細評価</CardTitle>
              <CardDescription>各観点のコメント</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {labels.map((l, i) => (
                  <AccordionItem value={`item-${i}`} key={l}>
                    <AccordionTrigger>{l}</AccordionTrigger>
                    <AccordionContent>{result.feedback.byAspect[i]}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>フィードバック</CardTitle>
              <CardDescription>改善点とおすすめリソース</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div>
                <div className="mb-1 font-semibold">良かった点</div>
                <ul className="list-disc pl-5">
                  {result.feedback.good.map((t, i) => (
                    <li key={`g-${i}`}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-semibold">改善点</div>
                <ul className="list-disc pl-5">
                  {result.feedback.improve.map((t, i) => (
                    <li key={`i-${i}`}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 font-semibold">推奨リソース</div>
                <ul className="list-disc pl-5">
                  {result.feedback.resources.map((t, i) => (
                    <li key={`r-${i}`}>{t}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  usePracticeStore.getState().addToReview({
                    id: currentQuestion.id,
                    title: currentQuestion.title,
                    category: selection.category,
                    difficulty: selection.difficulty,
                    lastScore: result.total,
                  })
                  toast({ title: "復習リストに追加しました" })
                }}
              >
                復習リストに追加
              </Button>
              <Button asChild variant="outline">
                <Link href="/practice">類似問題に挑戦</Link>
              </Button>
              <Button asChild>
                <Link href="/">ホームに戻る</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}
