'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import L from 'leaflet'
import { supabase } from '@/lib/supabase'

import 'leaflet/dist/leaflet.css'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  creator_id: string
  event_time: string | null
}

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function CleanupMap() {
  const router = useRouter()

  const [events, setEvents] = useState<Event[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [rsvps, setRsvps] = useState<string[]>([])

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)

      const { data: eventsData } = await supabase
        .from('cleanup_events')
        .select('*')

      setEvents((eventsData as Event[]) ?? [])

      if (user) {
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('user_id', user.id)

        setRsvps(rsvpData?.map((r) => r.event_id) ?? [])
      }
    }

    load()
  }, [])

  const toggleRsvp = async (eventId: string) => {
    if (!userId) {
      router.push('/login')
      return
    }

    const isGoing = rsvps.includes(eventId)

    if (isGoing) {
      await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)

      setRsvps((prev) => prev.filter((id) => id !== eventId))
    } else {
      await supabase.from('event_rsvps').insert({
        event_id: eventId,
        user_id: userId,
      })

      setRsvps((prev) => [...prev, eventId])
    }
  }

  const now = new Date()

  const getEventStatus = (eventTime: string | null) => {
    if (!eventTime) return 'upcoming'
    const t = new Date(eventTime)

    if (t < now) return 'past'
    return 'upcoming'
  }

  const greenIcon = new L.Icon({
    iconUrl: '/markers/green.png',
    iconSize: [40, 41],
    iconAnchor: [12, 41],
  })

  const redIcon = new L.Icon({
    iconUrl: '/markers/red.png',
    iconSize: [40, 41],
    iconAnchor: [12, 41],
  })

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
    <MapContainer
      center={[-34.9285, 138.6007]}
      zoom={11}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => {
        const status = getEventStatus(event.event_time)
        const icon = status === 'past' ? redIcon : greenIcon

        return (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={icon}
            eventHandlers={{
              click: () => router.push(`/event/${event.id}`),
            }}
          >
            <Popup>
              <div className="space-y-2">
                <div>
                  <strong>{event.title}</strong>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-gray-500">
                    {event.location_name}
                  </p>
                </div>

                {status !== 'past' && (
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    className="text-blue-600 text-sm"
                  >
                    {rsvps.includes(event.id)
                      ? 'Cancel RSVP'
                      : 'RSVP'}
                  </button>
                )}

                {status === 'past' && (
                  <p className="text-xs text-red-600">
                    Event completed
                  </p>
                )}

                {userId === event.creator_id && (
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 text-sm block"
                  >
                    Delete
                  </button>
                )}

                <button
                  onClick={() =>
                    router.push(`/event/${event.id}`)
                  }
                  className="text-green-600 text-sm block underline"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}