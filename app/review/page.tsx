"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePracticeStore } from "@/store/use-practice-store"
import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, RefreshCcw, Trash2 } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"

export default function Page() {
  const { reviewList, removeFromReview } = usePracticeStore()
  const [showDone, setShowDone] = useState(false)

  const pending = useMemo(() => reviewList.filter((r) => !r.done), [reviewList])
  const done = useMemo(() => reviewList.filter((r) => r.done), [reviewList])

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <AuthGuard
          title="復習リストはサインインが必要です"
          description="保存した復習対象を管理するにはサインインしてください。"
        >
          <h1 className="mb-6 text-2xl font-bold">復習</h1>

          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((item) => (
              <Card key={item.id} className="transition hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>
                    {item.category}・{item.difficulty}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">前回スコア: {item.lastScore}</CardContent>
                <CardFooter className="flex gap-2">
                  <Button asChild>
                    <Link href="/practice">再挑戦</Link>
                  </Button>
                  <Button variant="destructive" onClick={() => removeFromReview(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    削除
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <button
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowDone((s) => !s)}
              aria-expanded={showDone}
            >
              {showDone ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              復習済みリストを{showDone ? "閉じる" : "開く"}
            </button>
            {showDone && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {done.length === 0 ? (
                  <div className="text-sm text-muted-foreground">復習済みはありません。</div>
                ) : (
                  done.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription>
                          {item.category}・{item.difficulty}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm">最終スコア: {item.lastScore}</CardContent>
                      <CardFooter>
                        <Button asChild variant="outline">
                          <Link href="/practice">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            再挑戦
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </AuthGuard>
      </section>
    </main>
  )
}
