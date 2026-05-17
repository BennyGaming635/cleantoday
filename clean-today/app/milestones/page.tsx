'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

type GovUser = {
  username: string
  council_name: string
}

type Event = {
  id: string
  completed: boolean
  kg_collected: number | null
}

type Milestone = {
  title: string
  targetKg: number
  reward: string
  feature: string
}

export default function MilestonesPage() {
  const [govUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('gov_user')
    return stored ? JSON.parse(stored) : null
  })

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!govUser) return

    const load = async () => {
      const { data } = await supabase
        .from('cleanup_events')
        .select('id, completed, kg_collected')

      setEvents(data ?? [])
      setLoading(false)
    }

    load()
  }, [govUser])

  const totalKg = events.reduce(
    (sum, e) => sum + (e.kg_collected || 0),
    0
  )

  const completedEvents = events.filter((e) => e.completed).length
  const milestones: Milestone[] = [
    {
      title: 'Community Launch',
      targetKg: 0,
      reward: 'Clean Today launched!',
      feature: 'We are ready for you to make a difference',
    },
    {
      title: 'First Impact',
      targetKg: 100,
      reward: 'New map layers',
      feature: 'Heatmap enabled',
    },
    {
      title: 'Growing Movement',
      targetKg: 500,
      reward: 'Event Hype',
      feature: 'Hyped events will be featured on the homepage',
    },
    {
      title: 'City Cleaning',
      targetKg: 1000,
      reward: 'Friendly Competition',
      feature: 'Invite your friends and compete on the leaderboard',
    },
    {
      title: 'State Impact',
      targetKg: 5000,
      reward: 'Exclusive Badges',
      feature: 'Earn badges to show off your impact',
    },
    {
      title: 'National Movement',
      targetKg: 12000,
      reward: 'National Recognition',
      feature: 'Suburbs and states can compete for their recognition',
    },
]

const getProgress = (target: number) =>
    Math.min((totalKg / target) * 100, 100)

const getStatus = (target: number) => {
    if (totalKg >= target) return 'unlocked'
    if (totalKg >= target * 0.75) return 'near'
    return 'locked'
}

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center">
        <p>Loading milestones...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-10">

        <div>
          <h1 className="text-4xl font-bold text-green-900">
            Milestones
          </h1>
          <p className="text-gray-600 mt-2">
            System unlocks new features as total cleanup impact grows.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-600">Total Waste Collected</p>
            <p className="text-3xl font-bold text-green-700">
              {totalKg} kg
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-600">Completed Events</p>
            <p className="text-3xl font-bold text-blue-700">
              {completedEvents}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p className="text-gray-600">Milestones Reached</p>
            <p className="text-3xl font-bold text-green-800">
              {milestones.filter((m) => totalKg >= m.targetKg).length}
              /{milestones.length}
            </p>
          </div>
        </div>

        {/* Milestones list */}
        <div className="space-y-6">
          {milestones.map((m, i) => {
            const status = getStatus(m.targetKg)
            const progress = getProgress(m.targetKg)

            return (
              <div
                key={i}
                className={`bg-white p-6 rounded-2xl border ${
                  status === 'unlocked'
                    ? 'border-green-500'
                    : status === 'near'
                    ? 'border-yellow-400'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {m.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {m.feature}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {m.targetKg} kg
                    </p>
                    <p
                      className={`text-sm ${
                        status === 'unlocked'
                          ? 'text-green-700'
                          : status === 'near'
                          ? 'text-yellow-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {status === 'unlocked'
                        ? 'Unlocked'
                        : status === 'near'
                        ? 'Near unlock'
                        : 'Locked'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'unlocked'
                        ? 'bg-green-600'
                        : status === 'near'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Reward: {m.reward}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}