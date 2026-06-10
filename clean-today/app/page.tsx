'use client'

import { useEffect, useState } from 'react'
import Navbar from "@/components/navbar/Navbar"
import { supabase } from "@/lib/supabase"
import { Button } from "@heroui/react"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const router = useRouter()
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalKg: 0,
        totalAttendees: 0,
    })

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (session) {
                router.replace('/me')
            }
        }
    checkAuth()
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
    }, [router])

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="relative min-h-screen flex items-center overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                >
                    <source src="/dronestock.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 space-y-14 text-white">

                    <div className="max-w-4xl space-y-8">

                        <img
                            src="/brand/logo-c.png"
                            alt="Clean Today Logo"
                            className="w-24 h-24 mb-2"
                        />

                        <h1 className="text-6xl font-bold leading-tight">
                            Organise community cleanups.
                        </h1>

                        <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
                            Find or create community cleanups near you and make real environmental impact with people around you.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/explore">
                                <Button
                                    size="lg"
                                    className="bg-green-700 hover:bg-green-800 text-white px-7 py-4 rounded-2xl font-semibold"
                                >
                                    Explore Events
                                </Button>
                            </Link>

                            <Link href="/create">
                                <Button
                                    size="lg"
                                    className="bg-white text-green-800 px-7 py-4 rounded-2xl font-semibold"
                                >
                                    Create Event
                                </Button>
                            </Link>

                            <Link href="/support">
                                <Button
                                    size="lg"
                                    className="bg-white text-green-800 px-7 py-4 rounded-2xl font-semibold"
                                >
                                    Support Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            <section className="max-w-7xl mx-auto px-6 pt-24 pb-24 space-y-14">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Find cleanups
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Discover nearby cleanups in your community.
                        </p>
                    </div>

                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Join or RSVP
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Join events instantly and see who else is attending in your area.
                        </p>
                    </div>

                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Create impact
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Organise your own cleanup and bring your community together.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 pb-28">
                <h2 className="text-4xl font-bold text-gray-900 mb-10">
                    Community Impact
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
                        <p className="text-4xl font-bold text-green-700">
                            {stats.totalEvents}
                        </p>
                        <p className="text-gray-600 mt-2">Cleanups Hosted</p>
                    </div>

                    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
                        <p className="text-4xl font-bold text-green-700">
                            {stats.totalKg}kg
                        </p>
                        <p className="text-gray-600 mt-2">Waste Collected</p>
                    </div>

                    <div className="bg-white border rounded-3xl p-10 text-center shadow-sm">
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