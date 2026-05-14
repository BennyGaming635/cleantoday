'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
export default function CleanupMap() {
    return (
        <MapContainer center={[-34.9285, 138.6007]} zoom={11} className="h-150 w-full rounded-2xl">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker position={[-34.9285, 138.6007]}>
                <Popup>
                    Example Cleanup Event
                </Popup>
            </Marker>
        </MapContainer>
    )
}