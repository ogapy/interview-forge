"use client"

import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MarkdownEditor } from "@/components/markdown-editor"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePracticeStore } from "@/store/use-practice-store"
import { useRouter } from "next/navigation"
import { Clock, Save } from "lucide-react"
import dynamic from "next/dynamic"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { generateQuestion } from "@/lib/data"

const schema = z.object({
  answer: z.string().min(30, "30文字以上で回答してください"),
})

type FormValues = z.infer<typeof schema>

// Markdown viewer for the question content
const MPreview = dynamic(() => import("@uiw/react-markdown-preview").then((m) => m.default), {
  ssr: false,
})

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const selection = usePracticeStore((s) => s.selection)
  const draft = usePracticeStore((s) => s.draft)
  const setDraft = usePracticeStore((s) => s.setDraft)
  const setCurrentQuestion = usePracticeStore((s) => s.setCurrentQuestion)
  const currentQuestion = usePracticeStore((s) => s.currentQuestion)

  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<number | null>(null)

  // Prepare question
  useEffect(() => {
    if (!selection.category) {
      router.replace("/practice")
      return
    }
    if (!currentQuestion) {
      const q = generateQuestion(selection.category, selection.difficulty)
      setCurrentQuestion(q)
    }
  }, [selection, currentQuestion, setCurrentQuestion, router])

  useEffect(() => {
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  const { register, setValue, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { answer: draft ?? "" },
  })

  const onSubmit = (v: FormValues) => {
    setDraft(v.answer)
    router.push("/practice/result")
  }

  const onSaveDraft = () => {
    const v = (document.getElementById("hidden-answer") as HTMLTextAreaElement | null)?.value ?? ""
    setDraft(v)
    toast({ title: "下書きを保存しました" })
  }

  const mm = useMemo(() => String(Math.floor(seconds / 60)).padStart(2, "0"), [seconds])
  const ss = useMemo(() => String(seconds % 60).padStart(2, "0"), [seconds])

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{currentQuestion?.title ?? "読み込み中..."}</CardTitle>
                <CardDescription>
                  <Badge variant="default" className="mr-2">
                    {selection.category}
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    {selection.difficulty}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span aria-live="polite" aria-atomic="true">
                  {mm}:{ss}
                </span>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              {currentQuestion ? (
                <MPreview source={currentQuestion.content} />
              ) : (
                <div className="h-40 animate-pulse rounded-md bg-muted" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>回答入力</CardTitle>
              <CardDescription>Markdownに対応・プレビュー付き</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={formState.defaultValues?.answer}
                onChange={(val) => setValue("answer", val || "", { shouldValidate: true })}
                height={340}
              />
              <textarea id="hidden-answer" className="sr-only" {...register("answer")} />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  文字数: {(formState?.dirtyFields?.answer ? 0 : 0) || (formState.defaultValues?.answer?.length ?? 0)}
                </span>
                {formState.errors.answer && <span className="text-red-600">{formState.errors.answer.message}</span>}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleSubmit(onSubmit)} className="flex-1">
                提出
              </Button>
              <Button variant="outline" onClick={onSaveDraft} className="flex-1 bg-transparent">
                <Save className="mr-2 h-4 w-4" />
                下書き保存
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  )
}
