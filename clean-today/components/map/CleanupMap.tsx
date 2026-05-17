'use client'

import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
} from 'react-leaflet'
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

type FocusZone = {
  id: string
  title: string
  description: string
  council_username: string
  polygon: {
    lat: number
    lng: number
  }[]
}

delete (
  L.Icon.Default.prototype as {
    _getIconUrl?: unknown
  }
)._getIconUrl

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
  const [zones, setZones] = useState<FocusZone[]>([])
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

      setEvents(eventsData ?? [])

      const { data: zoneData } = await supabase
        .from('gov_zones')
        .select('*')

      if (zoneData) {
        const parsedZones = zoneData.map((zone) => ({
          ...zone,
          polygon:
            typeof zone.polygon === 'string'
              ? JSON.parse(zone.polygon)
              : zone.polygon,
        }))

        setZones(parsedZones)
      }

      if (user) {
        const { data: rsvpData } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('user_id', user.id)

        setRsvps(
          rsvpData?.map((r) => r.event_id) ?? []
        )
      }
    }

    load()
  }, [])

  const now = new Date()

  const getEventStatus = (
    eventTime: string | null
  ) => {
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

      {zones
        .filter(
          (zone) =>
            Array.isArray(zone.polygon) &&
            zone.polygon.length > 2
        )
        .map((zone) => (
          <Polygon
            key={zone.id}
            positions={zone.polygon.map(
              (p): [number, number] => [
                p.lat,
                p.lng,
              ]
            )}
            pathOptions={{
              color: '#16a34a',
              fillColor: '#22c55e',
              fillOpacity: 0.3,
              weight: 3,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <h2 className="font-bold text-green-700">
                  {zone.title}
                </h2>

                <p className="text-sm">
                  {zone.description}
                </p>

                <p className="text-xs text-gray-500">
                  Requested by {zone.council_username}
                </p>
              </div>
            </Popup>
          </Polygon>
        ))}

      {events.map((event) => {
        const status = getEventStatus(
          event.event_time
        )

        const icon =
          status === 'past'
            ? redIcon
            : greenIcon

        return (
          <Marker
            key={event.id}
            position={[
              event.latitude,
              event.longitude,
            ]}
            icon={icon}
            eventHandlers={{
              click: () =>
                router.push(`/event/${event.id}`),
            }}
          >
            <Popup>
              <div className="space-y-2">
                <div>
                  <strong>{event.title}</strong>

                  <p className="text-sm">
                    {event.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    {event.location_name}
                  </p>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/event/${event.id}`
                    )
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