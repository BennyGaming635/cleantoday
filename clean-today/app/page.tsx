'use client'

import { useEffect, useState } from 'react'
import Navbar from "@/components/navbar/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@heroui/react"
import Link from "next/link"

export default function HomePage() {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalKg: 0,
        totalAttendees: 0,
    })

    useEffect(() => {
        const loadStats = async () => {
            const { data: events } = await supabase
                .from('cleanup_events')
                .select('id, kg_collected')
            
            const { data: rsvps } = await supabase
                .from('rsvps')
                .select('id')

            const totalEvents = events?.length || 0
            const totalKg =
                events?.reduce(
                    (sum, e) => sum + Number(e.kg_collected || 0),
                    0
                ) || 0
            
                const totalAttendees = rsvps?.length || 0

                setStats({
                    totalEvents,
                    totalKg,
                    totalAttendees,
                })
            
        }

        loadStats()
    }, [])

    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 py-28 space-y-12">

                <div className="space-y-8">
                    <h1 className="text-6xl font-bold text-green-800 leading-tight">
                        Organise community cleanups.
                    </h1>

                    <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
                        Find or create community cleanups near you and make real environmental impact with people around you.
                    </p>

                    <div className="flex gap-4">
                        <Link href="/explore">
                        <Button size="lg" className="bg-green-700 text-white hover:bg-green-800">
                                Explore Events
                            </Button>
                        </Link>
                        <Link href="/create">
                        <Button size="lg" variant="outline" className="border-green-700 text-green-700 hover:bg-green-100">
                                Create Event
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Find cleanups
                        </h3>
                        <p className="text-gray-600">
                            Discover nearby cleanups in your community.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Join or RSVP
                        </h3>
                        <p className="text-gray-600">
                            Join events instantly and see who else is attending in your area.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Create impact
                        </h3>
                        <p className="text-gray-600">
                            Organise your own cleanup and bring your community together.
                        </p>
                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-24">
                <h2 className="text-4xl font-bold text-green-800 mb-10">
                    Community Impact.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-2xl p-8 text-center">
                        <p className="text-4xl font-bold text-green-700">
                            {stats.totalEvents}
                        </p>
                        <p className="text-gray-600 mt-2">Cleanups Hosted</p>
                    </div>
                    <div className="bg-white border rounded-2xl p-8 text-center">
                        <p className="text-4xl font-bold text-green-700">
                            {stats.totalKg}kg
                        </p>
                        <p className="text-gray-600 mt-2">Waste Collected</p>
                    </div>
                    <div className="bg-white border rounded-2xl p-8 text-center">
                        <p className="text-4xl font-bold text-green-700">
                            {stats.totalAttendees}
                        </p>
                        <p className="text-gray-600 mt-2">Total Participants</p>
                    </div>
                </div>
            </section>
        </main>
    )
}