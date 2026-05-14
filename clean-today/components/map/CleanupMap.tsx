'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { supabase } from '@/lib/supabase'

import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  creator_id: string
}

export default function CleanupMap() {
  const [events, setEvents] = useState<Event[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      // get user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserId(user?.id ?? null)

      // fetch events
      const { data, error } = await supabase
        .from('cleanup_events')
        .select('*')

      if (!error && data) {
        setEvents(data)
      }
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
    <MapContainer
      center={[-34.9285, 138.6007]}
      zoom={11}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
        >
          <Popup>
            <div className="space-y-1">
              <strong>{event.title}</strong>
              <p>{event.description}</p>
              <p className="text-xs text-gray-500">
                {event.location_name}
              </p>

              {userId === event.creator_id && (
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}