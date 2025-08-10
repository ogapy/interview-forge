"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: string
  name: string
  email: string
  avatarUrl?: string | null
}

type State = {
  user: User | null
}

type Actions = {
  login: (email: string, name?: string) => void
  logout: () => void
}

export const useAuthStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name) => {
        const uname = name || email.split("@")[0]
        set({
          user: {
            id: crypto.randomUUID(),
            name: uname.charAt(0).toUpperCase() + uname.slice(1),
            email,
            avatarUrl: null,
          },
        })
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "interview-forge-auth",
      version: 1,
    },
  ),
)
