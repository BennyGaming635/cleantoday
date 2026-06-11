'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'

export default function LoginPage() {
  const router = useRouter()

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    })
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    })
  }

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) return

      await supabase.from('profiles').upsert({
        id: user.id,
        username: user.user_metadata?.full_name || user.email,
        avatar_url: user.user_metadata?.avatar_url,
      })

      await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      router.push('/explore')
    }

    run()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow rounded-xl p-8 space-y-6">
            <img
              src="/brand/logo-c.png"
              alt="Clean Today"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-center text-green-700">
              Join Clean Today
            </h1>

            <p className="text-gray-500 mt-1 text-center">
              Sign in to create and join cleanup events
            </p>

            <button
              onClick={signInWithGitHub}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Continue with GitHub
            </button>

            <button
              onClick={signInWithGoogle}
              className="w-full bg-white text-black border py-3 rounded-lg"
            >
              Continue with Google
            </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}