'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dumbbell, LayoutDashboard, ListChecks, BookOpen, TrendingUp, Sparkles, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workouts', label: 'Workouts', icon: ListChecks },
  { href: '/exercises', label: 'Exercises', icon: BookOpen },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/coach', label: 'AI Coach', icon: Sparkles, highlight: true },
]

export default function AppNav({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Dumbbell className="h-5 w-5 text-violet-400" />
          <span className="hidden sm:inline">LetsWorkOut</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-500/20 text-violet-300'
                    : item.highlight
                    ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* User menu */}
        <div className="flex items-center gap-2">
          <span className="hidden md:block text-sm text-slate-400 truncate max-w-[160px]">
            {user.user_metadata?.name || user.email}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-slate-400 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-500/20 text-violet-300'
                    : item.highlight
                    ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
