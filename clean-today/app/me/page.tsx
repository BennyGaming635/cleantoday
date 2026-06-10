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

            setUsername(profile?.username || 'User')
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