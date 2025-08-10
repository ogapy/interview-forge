"use client"

import { Header } from "@/components/header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUp, Bot, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePracticeStore } from "@/store/use-practice-store"
import { generateFollowUp } from "@/lib/data"
import { AuthGuard } from "@/components/auth-guard"

type ChatMsg = { id: string; role: "assistant" | "user"; content: string; ts: number }

export default function Page() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "m1",
      role: "assistant",
      content: "面接モードへようこそ。まずは自己紹介と、直近で取り組んだ技術的な課題を1つ教えてください。",
      ts: Date.now(),
    },
  ])
  const [input, setInput] = useState("")
  const [seconds, setSeconds] = useState(0)
  const timer = useRef<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const addHistory = usePracticeStore((s) => s.addHistory)

  useEffect(() => {
    timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const mm = useMemo(() => String(Math.floor(seconds / 60)).padStart(2, "0"), [seconds])
  const ss = useMemo(() => String(seconds % 60).padStart(2, "0"), [seconds])

  const send = () => {
    const content = input.trim()
    if (!content) return
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    // Fake follow-up
    setTimeout(() => {
      const follow = generateFollowUp(content)
      const asst: ChatMsg = { id: crypto.randomUUID(), role: "assistant", content: follow, ts: Date.now() }
      setMessages((prev) => [...prev, asst])
    }, 700)
  }

  const endSession = () => {
    addHistory({
      category: "Interview",
      difficulty: "Medium",
      title: "リアルタイム面接セッション",
      totalScore: 70 + Math.floor(Math.random() * 21),
      detail: { accuracy: 70, completeness: 65, logic: 72, terminology: 68, communication: 75 },
      feedback: {
        good: ["回答のスピードが適切でした", "質問の意図を汲み取れていました"],
        improve: ["具体例をもう一つ追加しましょう", "結論ファーストを意識しましょう"],
        resources: ["System Design Primer", "Effective Communication for Engineers"],
        byAspect: ["-", "-", "-", "-", "-"],
      },
    })
    toast({ title: "セッションを終了しました", description: "履歴に保存しました" })
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-4 py-8">
        <AuthGuard title="面接モードはサインインが必要です" description="セッション内容と結果を履歴に保存します。">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold">リアルタイム面接モード</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span aria-live="polite">
                {mm}:{ss}
              </span>
            </div>
          </div>

          <Card className="flex h-[60vh] flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">チャット</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className={`flex items-start gap-3 ${m.role === "assistant" ? "" : "justify-end"}`}>
                  {m.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      m.role === "assistant" ? "bg-muted" : "bg-indigo-600 text-white dark:bg-indigo-500"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </CardContent>
          </Card>

          <div className="sticky bottom-2 mt-3 flex items-center gap-2 rounded-xl border bg-background p-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="回答を入力してエンターで送信..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />
            <Button onClick={send} size="icon" className="shrink-0">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={endSession} className="shrink-0 bg-transparent">
              終了
            </Button>
          </div>
        </AuthGuard>
      </section>
    </main>
  )
}
