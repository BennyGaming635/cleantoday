'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

const CreateMap = dynamic(() => import('@/components/map/CreateMap'), {
  ssr: false,
})

type GovUser = {
  username: string
  council_name: string
}

export default function GovCreateEventPage() {
  const router = useRouter()

  const [govUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem('gov_user')
    if (!stored) return null

    try {
      return JSON.parse(stored) as GovUser
    } catch {
      return null
    }
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!govUser) {
      router.push('/gov/login')
    }
  }, [govUser, router])

  const createEvent = async () => {
    if (!govUser) return
    if (!title || !locationName || !coords) return

    setLoading(true)

    const { error } = await supabase.from('cleanup_events').insert({
      title,
      description,
      location_name: locationName,
      latitude: coords.lat,
      longitude: coords.lng,
      event_time: eventTime ? new Date(eventTime).toISOString() : null,
      completed: false,
      kg_collected: 0,
      council_username: govUser.username,
    })

    setLoading(false)

    if (!error) {
      router.push('/gov/dashboard')
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
                Create a Cleanup Event
              </h1>
              <p className="text-gray-500 mt-1">
                Drop a pin and publish an official cleanup event.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">
              <input
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Location name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />

              <input
                type="datetime-local"
                className="w-full border p-3 rounded-lg text-gray-800"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />

              <textarea
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="text-sm text-gray-600">
                Selected:{' '}
                {coords
                  ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : 'None'}
              </div>

              <button
                onClick={createEvent}
                disabled={loading}
                className="w-full bg-green-700 text-white py-3 rounded-lg"
              >
                {loading ? 'Creating...' : 'Create Official Event'}
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