'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdmin } from '@/lib/adminAuth'

export default function AdminLogin() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const login = () => {
        const validUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME
        const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

        if (username === validUser && password === validPass) {
            setAdmin(true)
            router.push('/admin/dashboard')
        } else {
            setError('Invalid username or password')
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white-border-rounded-xl p-8 w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-green-800">
                    Admin Login
                </h1>

                <input
                className="w-full border p-2 rounded text-gray-700"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />

                <input
                className="w-full border p-2 rounded text-gray-700"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                )}

                <button
                onClick={login}
                className="w-full bg-green-600 text-white py-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    )
}