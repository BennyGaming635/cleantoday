'use client'

import { use, useEffect, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Profile = {
    id: string
    username: string
    avatar_url: string
    bio: string | null
}

export default function UserProfilePage() {
    const { id } = useParams<{ id: string}>()
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single()

            setUser(data)
            setLoading(false)
        }

        if (id) load()
    }, [id])

    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />
            
            <div className="max-w-3xl mx-auto p-6">
                {loading ? (
                    <p>Loading...</p>
                ) : !user ? (
                    <p>User not found :/</p>
                ) : (
                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={user.avatar_url}
                                className="w-20 h-20 rounded-full object-cover border"
                            />

                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {user.username}
                                </h1>
                                <p className="text-gray-500">Community Member</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-700 mb-2">Bio</h2>
                            <p className="text-gray-600">
                                {user.bio || 'This user has no bio yet.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}