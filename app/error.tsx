"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="max-w-md text-center">
        <h2 className="mb-2 text-2xl font-bold">問題が発生しました</h2>
        <p className="mb-4 text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => reset()}>再試行</Button>
      </div>
    </div>
  )
}
