'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@heroui/react'

type Profile = {
  username: string
  avatar_url: string
}

export default function Navbar() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) return

      await supabase.from('profiles').upsert({
        id: user.id,
        username: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
      })

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (profile) setProfile(profile)
    }

    run()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopRef.current &&
        !desktopRef.current.contains(event.target as Node)
      ) {
        setDesktopOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className="sticky top-0 z-[1000] w-full border-b bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link href="/" className="text-2xl font-bold text-green-700">
            Clean Today
          </Link>

          <div className="flex items-center gap-6">

            <div className="hidden md:flex gap-6 text-sm font-medium text-green-700">
              <Link href="/">Home</Link>
              <Link href="/explore">Explore</Link>
              <Link href="/create">Create</Link>
              <Link href="/users">Users</Link>
            </div>

            {profile ? (
              <div className="relative" ref={desktopRef}>
                <button onClick={() => setDesktopOpen(v => !v)}>
                  <img
                    src={profile.avatar_url}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                </button>

                {desktopOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b">
                      <p className="font-medium text-gray-800">
                        {profile.username}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 text-sm hover:bg-gray-50 text-green-700"
                      onClick={() => setDesktopOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm hover:bg-gray-50 text-green-700"
                      onClick={() => setDesktopOpen(false)}
                    >
                      Settings
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-green-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[99999] bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        ☰
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[99998] bg-black/40 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-6 space-y-4 animate-slideUp">

            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">Menu</p>
              <button onClick={() => setMobileOpen(false)}>✕</button>
            </div>

            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/explore" onClick={() => setMobileOpen(false)}>Explore</Link>
            <Link href="/create" onClick={() => setMobileOpen(false)}>Create</Link>
            <Link href="/users" onClick={() => setMobileOpen(false)}>Users</Link>

            {profile ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/profile" onClick={() => setMobileOpen(false)}>
                  Settings
                </Link>

                <button onClick={logout} className="text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}