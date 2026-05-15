'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  creator_id: string
}

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string
}

type RSVP = {
  user_id: string
}

export default function EventPage() {
  const { id } = useParams()
  const router = useRouter()

  const [event, setEvent] = useState<Event | null>(null)
  const [creator, setCreator] = useState<Profile | null>(null)

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

      const { data: eventData, error: eventError } = await supabase
        .from('cleanup_events')
        .select('*')
        .eq('id', id)
        .single()

      if (eventError || !eventData) {
        setLoading(false)
        return
      }

      setEvent(eventData)

      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', eventData.creator_id)
        .single()

      setCreator(creatorData)

      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', id)

      setRsvps(rsvpData?.map((r: RSVP) => r.user_id) ?? [])

      setLoading(false)
    }

    if (id) {
      load()
    }
  }, [id])

  const isGoing = userId ? rsvps.includes(userId) : false

  const toggleRsvp = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

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

    const { error } = await supabase
      .from('cleanup_events')
      .delete()
      .eq('id', event.id)

    if (!error) {
      router.push('/explore')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-6">
          Loading...
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-6">
          Event not found.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-green-700">
                {event.title}
              </h1>

              <p className="text-gray-500 mt-2">
                📍 {event.location_name}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Organiser
            </h2>

            {creator && (
              <div className="flex items-center gap-4">
                <img
                  src={creator.avatar_url}
                  alt={creator.username}
                  className="w-16 h-16 rounded-full border object-cover"
                />

                <div>
                  <h3 className="font-semibold text-lg text-gray-700">
                    {creator.username}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {creator.bio || 'No bio yet'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-600 font-medium">
                {rsvps.length} RSVP
                {rsvps.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleRsvp}
                className={`px-5 py-2 rounded-lg text-white transition ${
                  isGoing
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGoing ? 'Cancel RSVP' : 'RSVP'}
              </button>

              {userId === event.creator_id && (
                <button
                  onClick={deleteEvent}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Location
            </h2>

            <div className="w-full h-[400px] rounded-xl overflow-hidden border">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  event.longitude - 0.01
                },${event.latitude - 0.01},${
                  event.longitude + 0.01
                },${event.latitude + 0.01}&layer=mapnik&marker=${
                  event.latitude
                },${event.longitude}`}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Attendees
            </h2>

            {rsvps.length === 0 ? (
              <p className="text-gray-500">
                No attendees yet.
              </p>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {rsvps.map((user) => (
                  <div
                    key={user}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                  >
                    Attendee
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}