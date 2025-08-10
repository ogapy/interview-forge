# コンポーネントパターン集

## ページコンポーネント
```typescript
// app/[page-name]/page.tsx
"use client"

import { Header } from "@/components/header"

export default function PageName() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* コンテンツ */}
      </section>
    </main>
  )
}
```

## カードコンポーネント
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card className="transition hover:shadow-md">
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明文</CardDescription>
  </CardHeader>
  <CardContent>
    {/* コンテンツ */}
  </CardContent>
</Card>
```

## ボタンパターン
```typescript
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 基本ボタン
<Button>クリック</Button>

// バリアント
<Button variant="secondary">セカンダリ</Button>
<Button variant="outline">アウトライン</Button>
<Button variant="ghost">ゴースト</Button>
<Button variant="destructive">削除</Button>

// リンクボタン
<Button asChild>
  <Link href="/path">リンク</Link>
</Button>

// アイコン付き
<Button className="gap-2">
  テキスト
  <ArrowRight className="h-4 w-4" />
</Button>
```

## フォームパターン
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  name: z.string().min(1, "必須項目です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
})

type FormData = z.infer<typeof schema>

function FormComponent() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* フォームフィールド */}
    </form>
  )
}
```

## Zustand ストア使用
```typescript
import { useAuthStore } from "@/store/auth"
import { usePracticeStore } from "@/store/practice"

function Component() {
  // 全体を取得
  const authStore = useAuthStore()
  
  // 特定の値のみ取得（推奨）
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  
  // 複数の値を取得
  const { stats, history } = usePracticeStore()
  
  return <div>{user?.name}</div>
}
```

## レスポンシブデザイン
```typescript
// Tailwind CSS のレスポンシブプレフィックス
<div className="
  px-4 py-10           // モバイル
  md:px-6 md:py-14     // タブレット以上
  lg:px-8              // デスクトップ以上
">
  <div className="
    grid gap-4
    md:grid-cols-2       // タブレット以上で2カラム
    lg:grid-cols-3       // デスクトップ以上で3カラム
  ">
    {/* グリッドアイテム */}
  </div>
</div>
```

## ローディング状態
```typescript
import { Skeleton } from "@/components/ui/skeleton"

function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[150px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  )
}
```

## エラーハンドリング
```typescript
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">エラーが発生しました</h2>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4">
        もう一度試す
      </Button>
    </div>
  )
}
```

## ダイアログパターン
```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>開く</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>タイトル</DialogTitle>
      <DialogDescription>
        説明文
      </DialogDescription>
    </DialogHeader>
    {/* コンテンツ */}
  </DialogContent>
</Dialog>
```

## トースト通知
```typescript
import { toast } from "sonner"

// 成功
toast.success("保存しました")

// エラー
toast.error("エラーが発生しました")

// 情報
toast.info("お知らせ")

// カスタム
toast("カスタムメッセージ", {
  description: "詳細説明",
  action: {
    label: "元に戻す",
    onClick: () => console.log("Undo"),
  },
})
```