"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Moon, Sun, Lock, LogIn, LogOut, Settings, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/use-auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const nav = [
  { href: "/", label: "Home", protected: false },
  { href: "/practice", label: "Practice", protected: false },
  { href: "/history", label: "History", protected: true },
  { href: "/review", label: "Review", protected: true },
  { href: "/interview", label: "Interview", protected: true },
] as const

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  useEffect(() => setMounted(true), [])

  const handleNavClick = (href: string, needsAuth: boolean, e: React.MouseEvent) => {
    if (needsAuth && !user) {
      e.preventDefault()
      router.push(`/login?redirect=${encodeURIComponent(href)}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader className="mb-4">
                <SheetTitle>Interview Forge</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(item.href, item.protected, e)}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                      pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-foreground",
                    )}
                  >
                    <span>{item.label}</span>
                    {item.protected && <Lock className="h-3.5 w-3.5 opacity-60" />}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-90" aria-label="Go to home">
            Interview Forge
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, item.protected, e)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                pathname === item.href ? "text-indigo-600 dark:text-indigo-400" : "text-foreground",
              )}
              aria-label={`${item.label}${item.protected ? "（要ログイン）" : ""}`}
            >
              <span>{item.label}</span>
              {item.protected && <Lock className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase() || "ME"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="flex items-center">
                      <History className="mr-2 h-4 w-4" />
                      <span>履歴</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>設定（準備中）</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-600 focus:text-red-600 data-[highlighted]:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  サインアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/login?mode=signup">アカウント作成</Link>
              </Button>
              <Button asChild className="gap-2">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  サインイン
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
