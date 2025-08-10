"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useMemo, useState } from "react"
import { usePracticeStore } from "@/store/use-practice-store"
import { CATEGORY_LIST } from "@/lib/data"
import { cn } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"

export default function Page() {
  const { history } = usePracticeStore()
  const [category, setCategory] = useState<string>("all")
  const [sort, setSort] = useState<"date" | "score">("date")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  const filtered = useMemo(() => {
    let list = [...history]
    if (category !== "all") list = list.filter((h) => h.category === category)
    if (dateFrom) list = list.filter((h) => new Date(h.createdAt) >= new Date(dateFrom))
    if (dateTo) list = list.filter((h) => new Date(h.createdAt) <= new Date(dateTo + "T23:59:59"))
    if (sort === "date") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    else list.sort((a, b) => b.totalScore - a.totalScore)
    return list
  }, [history, category, sort, dateFrom, dateTo])

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <AuthGuard title="履歴はサインインが必要です" description="練習履歴はアカウントに紐づいて保存・表示されます。">
          <h1 className="mb-4 text-2xl font-bold">練習履歴</h1>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label>カテゴリ</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {CATEGORY_LIST.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>開始日</Label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label>終了日</Label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label>ソート</Label>
              <Select value={sort} onValueChange={(v) => setSort(v as "date" | "score")}>
                <SelectTrigger>
                  <SelectValue placeholder="ソート" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">日付順</SelectItem>
                  <SelectItem value="score">スコア順</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">該当する履歴がありません。</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((h) => (
                <Card key={h.id} className="transition hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">{h.title}</CardTitle>
                    <CardDescription>
                      {h.category}・{h.difficulty}・{new Date(h.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div
                      className={cn(
                        "text-lg font-semibold",
                        h.totalScore >= 80 ? "text-green-600" : h.totalScore >= 60 ? "text-amber-600" : "text-red-600",
                      )}
                    >
                      スコア: {h.totalScore}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/practice/result">詳細を見る</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </AuthGuard>
      </section>
    </main>
  )
}
