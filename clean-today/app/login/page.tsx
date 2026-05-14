'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    setLoading(false)

    if (error) alert(error.message)
    else alert('Check your email for the login link')
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={signIn}
          className="w-full bg-green-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send login link'}
        </button>
      </div>
    </div>
  )
}