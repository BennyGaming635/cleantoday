'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

type Profile = {
    id: string
    username: string
    avatar_url: string
    total_kg: number
}

export default function Leaderboard() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true)

            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
            
            const { data: events } = await supabase
                .from('cleanup_events')
                .select('creator_id, kg_collected')
                .eq('completed', true)

            const totals = new Map<string, number>()

            events?.forEach(event => {
                const current = totals.get(event.creator_id) || 0

                totals.set(
                    event.creator_id,
                    current + Number(event.kg_collected || 0)
                )
            })

            const leaderboard =
                profiles?.map(profile => ({
                    ...profile,
                    total_kg: totals.get(profile.id) || 0,
                }))
                .sort((a, b) => b.total_kg - a.total_kg) || []

            setUsers(leaderboard)
            setLoading(false)
        }

        loadLeaderboard()
    }, [])
                }))
            })
        }
    })
}