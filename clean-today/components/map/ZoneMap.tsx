'use client'

import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
} from 'react-leaflet'

import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

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

type Point = {
  lat: number
  lng: number
}

type Props = {
  onChange: (points: Point[]) => void
}

export default function ZoneMap({
  onChange,
}: Props) {
  useEffect(() => {
    import('leaflet-draw')
  }, [])

  return (
    <MapContainer
      center={[-34.9285, 138.6007]}
      zoom={12}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
          }}
          edit={{
            edit: false,
            remove: true,
          }}
          onCreated={(e) => {
            const layer = e.layer as L.Polygon

            const latlngs =
              layer.getLatLngs()[0] as L.LatLng[]

            const points = latlngs.map((p) => ({
              lat: p.lat,
              lng: p.lng,
            }))

            onChange(points)
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}