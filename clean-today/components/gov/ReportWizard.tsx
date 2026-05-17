'use client'

import { useState } from 'react'
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
} from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

type Props = {
    open: boolean
    onClose: () => void
    onGenerate: (data: {
        polygon: L.LatLng[]
        primaryColor: string
        secondaryColor: string
    }) => void
}

export default function ReportWizard({ open, onClose, onGenerate }: Props) {
    const [step, setStep] = useState(1)
    const [polygon, setPolygon] = useState<L.LatLng[]>([])
    const [primaryColor, setPrimaryColor] = useState('#15803d')
    const [secondaryColor, setSecondaryColor] = useState('#166534')

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold">
                        Make a new Report
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Step {step} of 3
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Select Report Area
                            </h3>
                            <p className="text-gray-600 mt-sm">
                                Draw a polygon around the area you want to report on.
                            </p>
                        </div>
                        <MapContainer
                        center={[51.505, -0.09]}
                        zoom={11}
                        className="h-[450px] rounded-2xl"
                        >
                            <TileLayer
                            attribution="© OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <FeatureGroup>
                                <EditControl
                                    position="topright"
                                    draw={{
                                        rectangle: false,
                                        circle: false,
                                        circlemarker: false,
                                        marker: false,
                                        polyline: false,
                                    }}
                                    onCreated={(e) => {
                                        const layer = e.layer as L.Polygon
                                        const latlngs = layer.getLatLngs()[0] as L.LatLng[]
                                        setPolygon(latlngs)
                                    }}
                                />
                            </FeatureGroup>
                        </MapContainer>
                    </div>
                )}
            </div>
        </div>
    )
}