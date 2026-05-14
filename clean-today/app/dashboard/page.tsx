'use client'

import {useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Event = {
    id: string
    title: string
    description: string
    location_name: string
    latitude: number
    longitude: number
}

export default function Dashboard() {
    const [User, setUser] = useState<User | null>(null)
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const deleteEvent = async (id: string) => {
        const confirmDelete = confirm('Are you sure you want to delete this event?')
        if (!confirmDelete) return
        const { error } = await supabase
        .from('cleanup_events')
        .delete()
        .eq('id', id)

        if (error) {
            alert(error.message)
        } else {
            setEvents((prev) => prev.filter((e) => e.id !== id))
        }
    }

    useEffect(() => {
        const load = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()

            if (!user) {
                setLoading(false)
                return
            }

            setUser(user)
            const { data, error } = await supabase
                .from('cleanup_events')
                .select('*')
                .eq('creator_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setEvents(data)
            }
            setLoading(false)
        }

        load()
    }, [])

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    if (!User) {
        return <div className="p-6">You must be logged in to view this page.</div>
    }
    
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Events</h1>

            {events.length === 0 ? (
                <p>No events created yet.</p>
            ) : (
                <div className="grid gap-4">
                {events.map((event) => (
                    <div
                    key={event.id}
                    className="border p-4 rounded-lg"
                    >
                        <h2 className="font-bold text-lg">{event.title}</h2>
                        <p>{event.description}</p>
                        <p className="text-sm text-gray-500">
                            {event.location_name}
                        </p>
                    </div>
                ))}
                </div>
            )}
        </div>
    )
}