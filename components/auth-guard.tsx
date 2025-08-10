"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import { usePathname, useRouter } from "next/navigation"

type Props = {
  title?: string
  description?: string
  children: React.ReactNode
}

export function AuthGuard({
  title = "サインインが必要です",
  description = "この機能を利用するには、アカウントでサインインしてください。",
  children,
}: Props) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()

  if (user) return <>{children}</>

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          サインインすると、以下が利用できます:
          <ul className="mt-2 list-disc pl-5">
            <li>練習履歴の保存と進捗の可視化</li>
            <li>復習リストの管理</li>
            <li>リアルタイム面接モードのセッション保存</li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}>サインイン</Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/login?mode=signup&redirect=${encodeURIComponent(pathname)}`)}
          >
            アカウント作成
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")}>
            ホームへ
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
