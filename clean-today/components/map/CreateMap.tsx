'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

// Fix marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Coords = {
  lat: number
  lng: number
}

type LocationMarkerProps = {
  onSelect: (coords: Coords) => void
}

function LocationMarker({ onSelect }: LocationMarkerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })

  return position ? <Marker position={position} /> : null
}

type CreateMapProps = {
  onSelect: (coords: Coords) => void
}

export default function CreateMap({ onSelect }: CreateMapProps) {
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

      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  )
}