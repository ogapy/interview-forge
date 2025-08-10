"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Difficulty, Question } from "@/lib/data"

type Selection = {
  category: string
  difficulty: Difficulty
  random: boolean
}

type HistoryItem = {
  id: string
  title: string
  category: string
  difficulty: Difficulty
  totalScore: number
  detail: {
    accuracy: number
    completeness: number
    logic: number
    terminology: number
    communication: number
  }
  feedback: {
    good: string[]
    improve: string[]
    resources: string[]
    byAspect: string[]
  }
  createdAt: string
}

type ReviewItem = {
  id: string
  title: string
  category: string
  difficulty: Difficulty
  lastScore: number
  done?: boolean
}

type State = {
  selection: Selection
  draft: string | null
  currentQuestion: Question | null
  history: HistoryItem[]
  reviewList: ReviewItem[]
  stats: {
    totalAnswers: number
    avgScore: number
    streak: number
  }
}

type Actions = {
  setSelection: (category: string, difficulty: Difficulty, random: boolean) => void
  setDraft: (v: string | null) => void
  setCurrentQuestion: (q: Question | null) => void
  addHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => void
  addToReview: (item: ReviewItem) => void
  removeFromReview: (id: string) => void
  clearDraft: () => void
}

function calcStats(history: HistoryItem[]) {
  const totalAnswers = history.length
  const avgScore =
    history.slice(0, 20).reduce((s, h) => s + h.totalScore, 0) / Math.max(1, Math.min(20, history.length))
  // Very simple streak calc: if last N days have entries
  const days = new Set(history.map((h) => new Date(h.createdAt).toDateString()))
  let streak = 0
  const d = new Date()
  for (;;) {
    const key = d.toDateString()
    if (days.has(key)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return { totalAnswers, avgScore: Math.round(avgScore), streak }
}

export const usePracticeStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      selection: { category: "", difficulty: "Medium", random: false },
      draft: null,
      currentQuestion: null,
      history: [],
      reviewList: [],
      stats: { totalAnswers: 0, avgScore: 0, streak: 0 },

      setSelection: (category, difficulty, random) => set({ selection: { category, difficulty, random } }),
      setDraft: (v) => set({ draft: v }),
      clearDraft: () => set({ draft: null }),
      setCurrentQuestion: (q) => set({ currentQuestion: q }),

      addHistory: (item) => {
        const h: HistoryItem = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...item,
        }
        const history = [h, ...get().history]
        const stats = calcStats(history)
        set({ history, stats })
      },

      addToReview: (item) => {
        const exists = get().reviewList.some((r) => r.id === item.id)
        if (exists) return
        set({ reviewList: [item, ...get().reviewList] })
      },

      removeFromReview: (id) => {
        set({ reviewList: get().reviewList.filter((r) => r.id !== id) })
      },
    }),
    {
      name: "interview-forge-store",
      version: 1,
      partialize: (s) => ({
        selection: s.selection,
        history: s.history,
        reviewList: s.reviewList,
        stats: s.stats,
        draft: s.draft,
      }),
    },
  ),
)
