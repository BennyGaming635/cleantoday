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
        <main className="min-h-screen bg-green-50">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-5xl font-bold text-green-700">
                    Welcome back, {username}!
                </h1>
            </div>
        </main>
    )
}