'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'

type UpcomingEvent = {
    id: number
    title: string
    event_time: string
}

export default function Me() {
    const [username, setUsername] = useState('')
    const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
    const [stats, setStats] = useState({
        badges: 0,
        kgCollected: 0,
        eventsHosted: 0,
    })
    
    useEffect(() => {
        const load = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) return

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            const { data: achievements } = await supabase
                .from('user_achievements')
                .select('achievement_key')
                .eq('user_id', user.id)
            
            const { data: events } = await supabase
                .from('cleanup_events')
                .select('kg_collected')
                .eq('creator_id', user.id)
                .eq('completed', true)

            const { data: upcoming } = await supabase
                .from('cleanup_events')
                .select('id, title, event_time')
                .gte('event_time', new Date().toISOString())
                .order('event_time', {ascending: true})
                .limit(5)

            setUpcomingEvents(upcoming || [])

            const badges = achievements?.length || 0
            const eventsHosted = events?.length || 0
            const kgCollected =
                events?.reduce(
                    (sum, event) => sum + Number(event.kg_collected || 0),
                    0
                ) ?? 0

            setUsername(profile?.username || 'User')
            setStats({
                badges,
                kgCollected,
                eventsHosted,
            })
        }
        load()
    }, [])

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 pt-24 pb-12">

                <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    Welcome back {username}!
                </h1>

                <p className="text-xl text-gray-600 mt-4">
                    Here&apos;s an overview of your impact so far.
                </p>
                </div>

            </section>

            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white border rounded-3xl p-10 shadow-sm">
                    <p className="text-4xl font-bold text-green-700">
                    {stats.badges}
                    </p>
                    <p className="text-gray-600 mt-2">
                    Badges Earned
                    </p>
                </div>

                <div className="bg-white border rounded-3xl p-10 shadow-sm">
                    <p className="text-4xl font-bold text-green-700">
                    {stats.kgCollected}kg
                    </p>
                    <p className="text-gray-600 mt-2">
                    Waste Collected
                    </p>
                </div>

                <div className="bg-white border rounded-3xl p-10 shadow-sm">
                    <p className="text-4xl font-bold text-green-700">
                    {stats.eventsHosted}
                    </p>
                    <p className="text-gray-600 mt-2">
                    Events Hosted
                    </p>
                </div>

                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Upcoming Events
                        </h2>

                        <div className="space-y-4">
                            {upcomingEvents.length === 0 && (
                                <p className="text-gray-500">
                                    No upcoming events.
                                </p>
                            )}

                            {upcomingEvents.map((event) => {
                                const date = new Date(event.event_time)

                                const month = date.toLocaleDateString('en-AU', {
                                    month: 'short',
                                })

                                const day = date.getDate()

                                const time = date.toLocaleTimeString('en-AU', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })

                                return (
                                    <Link
                                        key={event.id}
                                        href={`/event/${event.id}`}
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition border"
                                    >
                                        <div className="w-40 h-24 rounded-2xl border overflow-hidden flex flex-col shrink-0">
                                            <div className="bg-green-700 text-white text-xs font-bold text-center py-2 uppercase">
                                                {month}
                                            </div>

                                            <div className="flex-1 flex items-center justify-center text-4xl font-bold text-gray-900">
                                                {day}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {event.title}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {time}
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            Next Goal
                        </h2>

                        {(() => {
                            let nextGoal = 10
                            let badgeName = '10kg Club'

                            if (stats.kgCollected >= 10) {
                                nextGoal = 50
                                badgeName = '50kg Cleaner'
                            }

                            if (stats.kgCollected >= 50) {
                                nextGoal = 100
                                badgeName = '100kg Champion'
                            }

                            const remaining = Math.max(0, nextGoal - stats.kgCollected)

                            const percent = Math.min(
                                (stats.kgCollected / nextGoal) * 100,
                                100
                            )

                            return (
                                <div className="space-y-6">
                                    <p className="text-5xl font-bold text-green-700">
                                        {stats.kgCollected}kg
                                    </p>

                                    <p className="text-gray-600">
                                        {remaining}kg until
                                    </p>

                                    <p className="text-2xl font-semibold text-gray-900">
                                        {badgeName}
                                    </p>

                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mt-6">
                                        <div
                                            className="h-full bg-green-700 rounded-full"
                                            style={{
                                                width: `${percent}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </section>
            </main>
    )
}