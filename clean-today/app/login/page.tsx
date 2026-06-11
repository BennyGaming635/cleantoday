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
  <div className="relative min-h-screen overflow-hidden">
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/dronestock.mp4" type="video/mp4" />
    </video>

    <div className="absolute inset-0 bg-black/50" />

    <div className="relative z-10 flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur shadow-xl rounded-3xl p-8 space-y-6">
            <img
              src="/brand/logo-c.png"
              alt="Clean Today"
              className="w-20 h-20 mx-auto"
            />

            <h1 className="text-3xl font-bold text-center text-green-700">
              Join Clean Today
            </h1>

            <p className="text-gray-600 text-center">
              Create cleanups, track impact, and help improve your local community.
            </p>

            <button
              onClick={signInWithGitHub}
              className="w-full bg-black text-white py-3 rounded-xl"
            >
              Continue with GitHub
            </button>

            <button
              onClick={signInWithGoogle}
              className="w-full bg-white border py-3 rounded-xl"
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
  </div>
)
}