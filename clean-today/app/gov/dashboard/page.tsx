'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const GovMap = dynamic(() => import('@/components/map/GovMap'), {
  ssr: false,
})

type GovUser = {
  username: string
  council_name: string
  logo_url?: string
  theme_color?: string
}

type Event = {
  id: string
  title: string
  location_name: string
  completed: boolean
  kg_collected: number | null
  latitude: number | null
  longitude: number | null
  event_time: string | null
}

export default function GovDashboard() {
  const router = useRouter()

  const [govUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem('gov_user')
    return stored ? (JSON.parse(stored) as GovUser) : null
  })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? localStorage.getItem('gov_user')
        : null

    if (!stored) {
      router.push('/gov/login')
      return
    }

    const loadData = async () => {
      const { data } = await supabase
        .from('cleanup_events')
        .select(
          'id, title, location_name, completed, kg_collected, latitude, longitude, event_time'
        )

      if (data) setEvents(data as Event[])
      setLoading(false)
    }

    loadData()
  }, [router])

  const totalKg = events.reduce(
    (sum, e) => sum + (e.kg_collected || 0),
    0
  )

  const totalEvents = events.length

  const completed = events.filter((e) => e.completed).length
  const upcoming = events.filter((e) => !e.completed).length

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">

        <div>
          <h1
            suppressHydrationWarning
            className="text-4xl font-bold text-green-900"
          >
            {govUser?.council_name ||
              'Government Dashboard'}
          </h1>

          <p className="text-gray-600 mt-2">
            Environmental impact analytics overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Total Events</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalEvents}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-700">
              {completed}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-blue-700">
              {upcoming}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Total Waste (kg)</p>
            <p className="text-3xl font-bold text-green-800">
              {totalKg}
            </p>
          </div>

        </div>

        <div className="bg-white border rounded-3xl p-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Cleanup Map
          </h2>

          <div className="h-[450px] w-full">
            <GovMap events={events} />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            All Cleanups
          </h2>

          <div className="space-y-4">
            {events.map((e) => (
              <div
                key={e.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {e.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.location_name}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={
                      e.completed
                        ? 'text-red-600 font-medium'
                        : 'text-green-600 font-medium'
                    }
                  >
                    {e.completed
                      ? 'Completed'
                      : 'Upcoming'}
                  </p>

                  <p className="text-sm text-gray-500">
                    {e.kg_collected || 0} kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}