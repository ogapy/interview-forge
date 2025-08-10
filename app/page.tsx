"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart3, Clock, ListChecks, Lock } from "lucide-react"
import { usePracticeStore } from "@/store/use-practice-store"
import { useAuthStore } from "@/store/use-auth-store"

export default function Page() {
  const { stats, history } = usePracticeStore()
  const user = useAuthStore((s) => s.user)
  const recent = history.slice(0, 3)

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">技術面接の準備を、AIでスマートに</h1>
            <p className="text-muted-foreground">
              Interview Forgeは、問題生成・採点・フィードバックまでをワンストップで支援する技術面接練習アプリです。
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <Link href="/practice">
                  練習を始める
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/history">履歴を見る</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-indigo-50 to-white p-6 dark:from-indigo-950/30 dark:to-background">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="shadow-sm transition hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">総回答数</CardTitle>
                  <CardDescription>全期間</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{stats.totalAnswers}</CardContent>
              </Card>
              <Card className="shadow-sm transition hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">平均スコア</CardTitle>
                  <CardDescription>直近20件</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{stats.avgScore}</CardContent>
              </Card>
              <Card className="shadow-sm transition hover:shadow-md md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">連続練習日数</CardTitle>
                  <CardDescription>継続力</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{stats.streak}</CardContent>
              </Card>
            </div>
          </div>
        </div>

        {!user && (
          <Card className="mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" />
                サインインして進捗を保存しましょう
              </CardTitle>
              <CardDescription>履歴や復習リストはアカウントに紐づいて保存されます。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/login">サインイン</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login?mode=signup">アカウントを作成</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" />
                自分に合った出題
              </CardTitle>
              <CardDescription>カテゴリと難易度を選択可能</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                視覚的な評価
              </CardTitle>
              <CardDescription>レーダーチャートで弱点分析</CardDescription>
            </CardHeader>
          </Card>
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                タイマー付き
              </CardTitle>
              <CardDescription>面接本番を意識した練習</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">最近の練習</h2>
          {recent.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              まだ履歴がありません。まずは「練習を始める」から試してみましょう。
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {recent.map((h) => (
                <Card key={h.id} className="transition hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">{h.title}</CardTitle>
                    <CardDescription>
                      {h.category}・{h.difficulty}・{new Date(h.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    スコア: <span className="font-semibold">{h.totalScore}</span>
                    <div className="mt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href="/practice/result">結果を見る</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
