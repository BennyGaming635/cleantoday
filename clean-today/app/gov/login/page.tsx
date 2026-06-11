'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function GovLoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('gov_accounts')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) {
      setError('Invalid credentials')
      setLoading(false)
      return
    }

    localStorage.setItem(
      'gov_user',
      JSON.stringify(data)
    )

    router.push('/gov/dashboard')
  }

  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/brand/logo-c.png"
            alt="Clean Today"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-green-800">
            Government Portal
          </h1>
          <p className="text-gray-600 mt-2">
            Access council tools and community cleanup management.
          </p>
        </div>
        <div className="bg-white rounded-3xl border shadow-sm p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') login()
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input className="w-full border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') login()
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-700 etxt-sm">
                {error}
              </p>
            </div>
          )}
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          Clean Today Government Portal
        </p>
      </div>
    </main>
  )
}