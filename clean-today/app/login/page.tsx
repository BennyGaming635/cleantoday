'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const signIn = async () => {
    if (!email) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow rounded-xl p-8 space-y-6">

            <div>
              <h1 className="text-3xl font-bold text-green-700">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-1">
                Sign in to create and join cleanup events
              </p>
            </div>

            {sent ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                Check your email for a login link.
              </div>
            ) : (
              <>

                <input
                  className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  onClick={signIn}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
                >
                  {loading ? 'Sending link...' : 'Send magic link'}
                </button>
              </>
            )}

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to join cleanup events and help keep your community clean!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}