'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

declare module 'leaflet' {
  export function heatLayer(
    latlngs: [number, number, number][],
    options?: L.HeatLayerOptions
  ): L.Layer

  export interface HeatLayerOptions {
    radius?: number
    blur?: number
    maxZoom?: number
    max?: number
    minOpacity?: number
  }
}

type Event = {
  id: string
  latitude: number | null
  longitude: number | null
  kg_collected: number | null
}

function HeatLayer({ events }: { events: Event[] }) {
  const map = useMap()
  const layerRef = useRef<L.Layer | null>(null)

  useEffect(() => {
    if (!map) return

    const points: [number, number, number][] = events
      .filter(
        (e) =>
        typeof e.latitude === 'number' &&
        typeof e.longitude === 'number' &&
        !isNaN(e.latitude) &&
        !isNaN(e.longitude)
      )
      .map((e) => {
        const intensity = Math.max(
          0.2,
          Math.min((e.kg_collected || 1) / 50, 1)
        )

        return [
          e.latitude!,
          e.longitude!,
          intensity,
        ]
      })

    if (layerRef.current) {
      map.removeLayer(layerRef.current)
    }

    layerRef.current = L.heatLayer(points, {
    radius: 25,
    blur: 18,
    maxZoom: 17,
    }).addTo(map)

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
      }
    }
  }, [map, events])

  return null
}

export default function GovMap({
  events,
}: {
  events: Event[]
}) {
  const center: [number, number] = [
    -34.9285, 138.6007,
  ]

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={11}
        className="h-[500px] w-full rounded-2xl"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer events={events} />
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow text-xs">
        <p className="font-semibold mb-1">
          Government Heatmap
        </p>
        <p>🔵 Low waste zones</p>
        <p>🟣 Medium impact</p>
        <p>🔴 High pollution zones</p>
      </div>
    </div>
  )
}