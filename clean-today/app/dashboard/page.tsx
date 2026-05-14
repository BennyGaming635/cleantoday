'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  creator_id: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }

      setUser(user)

      const { data: eventsData } = await supabase
        .from('cleanup_events')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      setEvents(eventsData ?? [])

      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('event_id')

      const counts: Record<string, number> = {}

      rsvpData?.forEach((r) => {
        counts[r.event_id] = (counts[r.event_id] || 0) + 1
      })

      setRsvpCounts(counts)

      setLoading(false)
    }

    load()
  }, [])

  const deleteEvent = async (id: string) => {
    const confirmDelete = confirm('Delete this event?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('cleanup_events')
      .delete()
      .eq('id', id)

    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              My Events
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your cleanup events
            </p>
          </div>

          {loading && (
            <div className="text-gray-500">Loading events...</div>
          )}

          {!loading && events.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow text-gray-500">
              You haven’t created any events yet.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow p-5 space-y-3 hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  📍 {event.location_name}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-blue-600 text-sm font-medium">
                    RSVPs: {rsvpCounts[event.id] || 0}
                  </div>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}