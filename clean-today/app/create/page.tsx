'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'

const CreateMap = dynamic(() => import('@/components/map/CreateMap'), {
  ssr: false,
})

export default function CreatePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const [loading, setLoading] = useState(false)

  const createEvent = async () => {
    if (!title || !description || !locationName) {
      alert('Please fill in all fields')
      return
    }

    if (!coords) {
      alert('Select a location on the map')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        alert('You must be logged in to create events')
        setLoading(false)
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

      if (error) {
        alert(error.message)
        return
      }

      alert('Event created')

      setTitle('')
      setDescription('')
      setLocationName('')
      setCoords(null)
    } catch {
      alert('Unexpected error creating event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      <div className="p-6 space-y-4 overflow-y-auto">
        <h1 className="text-2xl font-bold">Create Cleanup Event</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Location name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <p>
          Selected:{' '}
          {coords
            ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
            : 'None'}
        </p>

        <button
          onClick={createEvent}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </div>

      <CreateMap onSelect={setCoords} />
    </div>
  )
}