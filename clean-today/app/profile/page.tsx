'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const avatar =
        user.user_metadata.avatar_url || ''

      setAvatarUrl(avatar)

      const githubName =
        user.user_metadata.user_name ||
        user.user_metadata.full_name ||
        ''

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!data) {
        await supabase.from('profiles').insert({
          id: user.id,
          username: githubName,
          bio: '',
          avatar_url: avatar,
        })

        setUsername(githubName)
      } else {
        setUsername(data.username || githubName)
        setBio(data.bio || '')
        setAvatarUrl(data.avatar_url || avatar)
      }

      setLoading(false)
    }

    load()
  }, [])

  const saveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
      })

    if (error) {
      alert(error.message)
    } else {
      alert('Profile updated')
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">

          <div className="bg-white rounded-xl shadow p-8 space-y-6">

            <div className="text-center space-y-4">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full mx-auto border"
              />

              <div>
                <h1 className="text-3xl font-bold text-green-700">
                  Your Profile
                </h1>

                <p className="text-gray-500 mt-1">
                  Customize your profile
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Name
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-3 rounded-lg text-gray-600"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-3 rounded-lg text-gray-600"
                rows={4}
                placeholder="Tell people about yourself..."
              />
            </div>

            <button
              onClick={saveProfile}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
            >
              Save Profile
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}