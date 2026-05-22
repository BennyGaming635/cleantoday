'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/explore`,
      },
    })

    if (error) {
      alert(error.message)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/explore`,
      },
    })

    if (error) {
      alert(error.message)
    }
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
  if (!session?.user) return

  const user = session.user

  await supabase.from('profiles').upsert({
    id: user.id,
    username: user.user_metadata?.full_name || user.email,
    avatar_url: user.user_metadata?.avatar_url,
  })
})

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
              <button
                onClick={signInWithGitHub}
                className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                Continue with GitHub
              </button>
              <button
                onClick={signInWithGoogle}
                className="w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                Continue with Google
              </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to the <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a>and <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}