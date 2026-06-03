'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string | null
}

type Achievement = {
  id: string
  achievement_key: string
  earned_at: string
  desc: string
}

const getLevel = (kg: number) => {
  if (kg >= 1000) {
    return {
      level: 7,
      title: 'Cleanup Legend',
    }
  }

  if (kg >= 600) {
    return {
      level: 6,
      title: 'Planet Guardian',
    }
  }

  if (kg >= 300) {
    return {
      level: 5,
      title: 'Eco Champion',
    }
  }

  if (kg >= 150) {
    return {
      level: 4,
      title: 'Waste Warrior',
    }
  }

  if (kg >= 75) {
    return {
      level: 3,
      title: 'Beach Protector',
    }
  }

  if (kg >= 25) {
    return {
      level: 2,
      title: 'Community Helper',
    }
  }

  return {
    level: 1,
    title: 'Rookie Cleaner',
  }
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [totalKgCollected, setTotalKgCollected] = useState(0)
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const userLevel = getLevel(totalKgCollected)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [organisedCount, setOrganisedCount] = useState(0)
  const [attendedCount, setAttendedCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      setUser(profile)

      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', id)

      setAchievements(achievementsData || [])

      const { data: completedEvents } = await supabase
        .from('cleanup_events')
        .select('kg_collected')
        .eq('creator_id', id)
        .eq('completed', true)

      const totalKg =
        completedEvents?.reduce((sum, event) => {
          return sum + Number(event.kg_collected || 0)
        }, 0) || 0

      setTotalKgCollected(totalKg)

      const { count: organised } = await supabase
        .from('cleanup_events')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', id)

      setOrganisedCount(organised ?? 0)

      const { count: attended } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id)

      setAttendedCount(attended ?? 0)

      setLoading(false)
    }

    if (id) load()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50">
        <Navbar />
        <div className="p-6">Loading...</div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-green-50">
        <Navbar />
        <div className="p-6">User not found</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white border rounded-xl p-6 flex items-center gap-4">
          <img
            src={user.avatar_url}
            className="w-20 h-20 rounded-full border object-cover"
            alt={user.username}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.username}
            </h1>
            <p className="text-gray-500">Community member</p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-2">Bio</h2>
          <p className="text-gray-600">
            {user.bio || 'No bio yet'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-green-700">
              {organisedCount}
            </p>
            <p className="text-sm text-gray-600">
              Events organised
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-green-700">
              {attendedCount}
            </p>
            <p className="text-sm text-gray-600">
              Events attended
            </p>
          </div>

          <div className="bg-white border rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-green-700">
              {totalKgCollected} kg
            </p>
            <p className="text-sm text-gray-600">
              Total collected
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-gray-500">
              Level
            </p>

            <h2 className="text-3xl font-bold text-green-700">
              Level {userLevel.level}
            </h2>

            <p className="text-gray-700 mt-1">
              {userLevel.title}
            </p>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="border rounded-xl p-4 text-center">
                <img
                  src={`/achievements/${achievement.achievement_key}.png`}
                  alt={achievement.achievement_key}
                  className="w-25 h-25 mx-auto mb-2"
                />
                <p className="font-semibold text-green-700">
                  {achievement.achievement_key.replace(/_/g, ' ')}
                </p>

                <p className="text-xs text-gray-500">
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}