'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">
          Clean Today
        </h1>

        <div className="flex gap-6 text-sm font-medium text-green-700">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/create">Create Event</Link>
          <Link href="/dashboard">Dashboard</Link>

          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}