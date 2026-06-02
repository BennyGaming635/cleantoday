'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

export default function LoginPage() {

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user
        if (!user) return

        await supabase.from('profiles').upsert({
          id: user.id,
          username:
            user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
        })

        if (new Date() < new Date('2026-08-01T00:00:00Z')) {
          await supabase.from('user_achievements').upsert({
            user_id: user.id,
            achievement_key: 'beta_tester',
            earned_at: new Date().toISOString(),
            desc: 'Joined Clean Today during beta access',
          })
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/explore`,
      },
    })
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/explore`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white shadow rounded-xl p-8 space-y-6">
            <h1 className="text-3xl font-bold text-green-700">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-1">
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
              className="w-full bg-white border py-3 rounded-lg"
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