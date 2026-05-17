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

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Branding Options
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Customise the appearance of your report.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">
                                    Primary Colour
                                </label>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) =>
                                        setPrimaryColor(e.target.value)
                                    }
                                    className="w-full h-16 rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    Secondary Colour
                                </label>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) =>
                                        setSecondaryColor(e.target.value)
                                    }
                                    className="w-full h-16 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 text-center">
                        <div>
                            <h3 className="text-2xl font-bold">
                                Ready to Generate!
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Click the button below to generate your report.
                            </p>
                        </div>
                        <div className="flex-justify-center gap-4">
                            <div
                            className="w-20 h-20 rounded-2xl"
                            style={{ backgroundColor: primaryColor }}
                            />
                            <div
                            className="w-20 h-20 rounded-2xl"
                            style={{ backgroundColor: secondaryColor }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">

                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-5 py-3 rounded-xl border"
                            >
                                Back
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="bg-green-700 text-white px-5 py-3 rounded-xl"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                onGenerate({
                                    polygon,
                                    primaryColor,
                                    secondaryColor,
                                })
                                }
                                className="bg-green-700 text-white px-5 py-3 rounded-xl"
                            >
                                Generate Report
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}