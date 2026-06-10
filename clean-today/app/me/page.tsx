'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

export default function Me() {
    const [username, setUsername] = useState('')
    
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
}