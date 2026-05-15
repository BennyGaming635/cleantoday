'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Profile = {
  username: string
  avatar_url: string
}

export default function Navbar() {
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-[1000] w-full border-b bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          Clean Today
        </Link>

        <div className="flex items-center gap-6">

          <div className="hidden md:flex gap-6 text-sm font-medium text-green-700">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/create">Create Event</Link>
          </div>

          {profile ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="focus:outline-none"
              >
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-10 h-10 rounded-full border object-cover"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">

                  <div className="px-4 py-3 border-b">
                    <p className="font-medium text-gray-800">
                      {profile.username}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-sm hover:bg-gray-50 text-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm hover:bg-gray-50 text-gray-800"
                    onClick={() => setMenuOpen(false)}
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
            <Link
              href="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}