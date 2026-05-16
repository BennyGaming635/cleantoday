'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function GovLoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async () => {
    setError('')

    const { data, error } = await supabase
      .from('gov_accounts')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) {
      setError('Invalid credentials')
      return
    }

    localStorage.setItem(
      'gov_user',
      JSON.stringify(data)
    )

    router.push('/gov/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white border rounded-3xl p-10 w-full max-w-md space-y-6">

        <h1 className="text-3xl font-bold text-green-800">
          Government Login
        </h1>

        <input
          className="w-full border p-3 rounded-xl text-gray-800"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded-xl text-gray-800"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl"
        >
          Login
        </button>

      </div>
    </main>
  )
}