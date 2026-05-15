'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, bio')

      setUsers(data || [])
      setLoading(false)
    }

    load()
  }, [])

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Users
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {users.map((u) => (
              <Link
                key={u.id}
                href={`/users/${u.id}`}
                className="bg-white border rounded-xl p-4 flex items-center gap-4 hover:shadow transition"
              >
                <img
                  src={u.avatar_url}
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {u.username}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {u.bio || 'No bio yet'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}