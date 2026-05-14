'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  creator_id: string
}

type RSVP = {
  user_id: string
}

export default function EventPage() {
  const { id } = useParams()
  const router = useRouter()

  const [event, setEvent] = useState<Event | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [rsvps, setRsvps] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)

      const { data: eventData } = await supabase
        .from('cleanup_events')
        .select('*')
        .eq('id', id)
        .single()

      setEvent(eventData)

      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', id)

      setRsvps(rsvpData?.map((r: RSVP) => r.user_id) ?? [])

      setLoading(false)
    }

    if (id) load()
  }, [id])

  const isGoing = userId ? rsvps.includes(userId) : false

  const toggleRsvp = async () => {
    if (!userId) return router.push('/login')

    if (!event) return

    if (isGoing) {
      await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', userId)

      setRsvps((prev) => prev.filter((u) => u !== userId))
    } else {
      await supabase.from('event_rsvps').insert({
        event_id: event.id,
        user_id: userId,
      })

      setRsvps((prev) => [...prev, userId])
    }
  }

  const deleteEvent = async () => {
    if (!event) return

    const confirmDelete = confirm('Delete this event?')
    if (!confirmDelete) return

    await supabase.from('cleanup_events').delete().eq('id', event.id)

    router.push('/explore')
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!event) return <div className="p-6">Event not found</div>

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white p-6 rounded-xl shadow">
            <h1 className="text-3xl font-bold text-green-700">
              {event.title}
            </h1>

            <p className="text-gray-600 mt-2">
              {event.description}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Location: {event.location_name}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
            <div className="text-blue-600 font-medium">
              Attendees: {rsvps.length}
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleRsvp}
                className={`px-4 py-2 rounded-lg text-white ${
                  isGoing
                    ? 'bg-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGoing ? 'Cancel RSVP' : 'RSVP'}
              </button>

              {userId === event.creator_id && (
                <button
                  onClick={deleteEvent}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Location</h2>

            <div className="w-full h-64 rounded-lg overflow-hidden border">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  event.longitude - 0.01
                },${event.latitude - 0.01},${event.longitude + 0.01},${
                  event.latitude + 0.01
                }&layer=mapnik&marker=${event.latitude},${event.longitude}`}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Attendees</h2>

            {rsvps.length === 0 ? (
              <p className="text-gray-500">No RSVPs yet.</p>
            ) : (
              <p className="text-gray-600">
                {rsvps.length} people are attending this cleanup.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}