"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/use-auth-store"
import { Mail, UserPlus } from "lucide-react"

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "6文字以上で入力してください"),
})

type FormValues = z.infer<typeof schema>

export default function Page() {
  const router = useRouter()
  const search = useSearchParams()
  const redirect = search.get("redirect") || "/"
  const mode = search.get("mode") || "signin"
  const login = useAuthStore((s) => s.login)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } })

  const onSubmit = async (v: FormValues) => {
    // Simulate login; integrate Supabase/NextAuth here in the future
    login(v.email)
    router.push(redirect)
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-md px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>{mode === "signup" ? "アカウント作成" : "サインイン"}</CardTitle>
            <CardDescription>
              {mode === "signup" ? "メールとパスワードで登録します" : "登録済みのメールとパスワードでサインイン"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              aria-label={mode === "signup" ? "Sign up form" : "Sign in form"}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Mail className="mr-2 h-4 w-4" />
                {mode === "signup" ? "登録して続行" : "サインイン"}
              </Button>
            </form>

            <Separator />

            <div className="grid gap-2">
              <Button variant="outline" className="w-full bg-transparent" disabled>
                Googleで続行（準備中）
              </Button>
              <Button variant="outline" className="w-full bg-transparent" disabled>
                GitHubで続行（準備中）
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => router.push("/")}>
              ゲストのまま続ける
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                router.push(
                  `/login?mode=${mode === "signup" ? "signin" : "signup"}&redirect=${encodeURIComponent(redirect)}`,
                )
              }
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {mode === "signup" ? "既にアカウントがあります" : "アカウントを作成"}
            </Button>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}
