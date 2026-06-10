'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

export default function Me() {
    const [username, setUsername] = useState('')
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
                <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                    Welcome back {username}
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
            </main>
    )
}