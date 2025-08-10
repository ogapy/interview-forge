"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CATEGORY_LIST } from "@/lib/data"
import { usePracticeStore } from "@/store/use-practice-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const schema = z.object({
  category: z.string().min(1, "カテゴリを選択してください"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  random: z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const setSelection = usePracticeStore((s) => s.setSelection)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "", difficulty: "Medium", random: false },
  })

  const selectedCategory = watch("category")
  const difficulty = watch("difficulty")
  const random = watch("random")

  const onSubmit = (values: FormValues) => {
    setSelection(values.category, values.difficulty, values.random)
    toast({ title: "準備完了", description: "問題をロードします..." })
    router.push("/practice/answer")
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">問題を選択</h1>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>カテゴリ</CardTitle>
              <CardDescription>得意・強化したい分野を選びましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORY_LIST.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setValue("category", c.key)}
                    className={`group rounded-lg border p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      selectedCategory === c.key ? "border-indigo-500 ring-2 ring-indigo-500" : ""
                    }`}
                    aria-pressed={selectedCategory === c.key}
                  >
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.desc}</div>
                  </button>
                ))}
              </div>
              {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>難易度</CardTitle>
              <CardDescription>自分に合ったレベルを選択</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <RadioGroup
                value={difficulty}
                onValueChange={(v) => setValue("difficulty", v as FormValues["difficulty"])}
                className="grid grid-cols-3 gap-2"
              >
                {(["Easy", "Medium", "Hard"] as const).map((lvl) => (
                  <div key={lvl} className="flex items-center gap-2 rounded-md border p-2">
                    <RadioGroupItem value={lvl} id={lvl} />
                    <Label htmlFor={lvl}>{lvl}</Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">ランダム出題</div>
                  <div className="text-xs text-muted-foreground">選んだカテゴリ内でランダムに出題します</div>
                </div>
                <Switch checked={random} onCheckedChange={(v) => setValue("random", v)} />
              </div>

              <Button className="w-full" onClick={handleSubmit(onSubmit)}>
                練習開始
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
