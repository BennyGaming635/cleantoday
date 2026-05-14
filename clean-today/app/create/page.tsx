'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

const CreateMap = dynamic(() => import('@/components/map/CreateMap'), {
  ssr: false,
})

export default function CreatePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const createEvent = async () => {
    if (!title || !description || !locationName || !coords) return

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('cleanup_events').insert({
      title,
      description,
      location_name: locationName,
      latitude: coords.lat,
      longitude: coords.lng,
      creator_id: user.id,
    })

    setLoading(false)

    if (!error) {
      router.push('/explore')
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-green-700">
                Make a Clean Up
              </h1>
              <p className="text-gray-500 mt-1">
                Drop a pin, add details, and invite others to clean up.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <input
                className="w-full border p-3 rounded-lg text-gray-600"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="w-full border p-3 rounded-lg text-gray-600"
                placeholder="Location name (e.g. Henley Beach)"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />

              <textarea
                className="w-full border p-3 rounded-lg text-gray-600"
                placeholder="Describe the cleanup..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="text-sm text-gray-600">
                Selected location:{' '}
                {coords
                  ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : 'None'}
              </div>

              <button
                onClick={createEvent}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 border-l">
          <CreateMap onSelect={setCoords} />
        </div>
      </div>
    </div>
  )
}