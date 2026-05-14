'use client'

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function CleanupMap() {
    return (
        <MapContainer center={[-34.9285, 138.6007]} zoom={11} className="h-full w-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-34.9285, 138.6007]}>
                <Popup>
                    A cleanup event here!
                </Popup>
            </Marker>
        </MapContainer>
    )
}