'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  username: string
  avatar_url: string
  totalKg: number
}

export default function Leaderboard() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')

      const { data: events } = await supabase
        .from('cleanup_events')
        .select('creator_id, kg_collected')
        .eq('completed', true)

      const totals = new Map<string, number>()

      events?.forEach(event => {
        const current = totals.get(event.creator_id) || 0

        totals.set(
          event.creator_id,
          current + Number(event.kg_collected || 0)
        )
      })

      const leaderboard =
        profiles?.map(profile => ({
          ...profile,
          totalKg: totals.get(profile.id) || 0,
        }))
        .sort((a, b) => b.totalKg - a.totalKg) || []

      setUsers(leaderboard)
      setLoading(false)
    }

    loadLeaderboard()
  }, [])

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700">
            Leaderboard
          </h1>

          <p className="text-gray-600 mt-2">
            Ranked by total kilograms of waste collected.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border p-6">
            Loading leaderboard...
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            {users.map((user, index) => {
              const rank = index + 1

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 border-b last:border-b-0"
                >
                  <div className="w-12 text-center">
                    {rank === 1 && (
                      <span className="text-2xl">🥇</span>
                    )}

                    {rank === 2 && (
                      <span className="text-2xl">🥈</span>
                    )}

                    {rank === 3 && (
                      <span className="text-2xl">🥉</span>
                    )}

                    {rank > 3 && (
                      <span className="font-bold text-gray-500">
                        #{rank}
                      </span>
                    )}
                  </div>

                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-12 h-12 rounded-full border object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/users/${user.id}`}
                      className="font-semibold text-gray-800 hover:text-green-700"
                    >
                      {user.username}
                    </Link>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-green-700 text-lg">
                      {user.totalKg.toLocaleString()} kg
                    </div>

                    <div className="text-xs text-gray-500">
                      Collected
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}