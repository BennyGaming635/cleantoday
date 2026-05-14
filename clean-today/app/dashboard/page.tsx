'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
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

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return (
      <div className="p-6">
        Please log in to view your dashboard.
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Events</h1>

      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded-lg space-y-2"
            >
              <h2 className="font-bold text-lg">
                {event.title}
              </h2>

              <p>{event.description}</p>

              <p className="text-sm text-gray-500">
                {event.location_name}
              </p>

              <p className="text-sm text-blue-600">
                RSVPs: {rsvpCounts[event.id] || 0}
              </p>

              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}