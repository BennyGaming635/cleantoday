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
  const [eventTime, setEventTime] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [agreed, setAgreed] = useState(false)

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
      event_time: eventTime ? new Date(eventTime).toISOString() : null,
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

      <div className="flex flex-1">
        <div className="w-full md:w-1/2 p-8">
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
              <input
                type="datetime-local"
                className="w-full border p-3 rounded-lg text-gray-600"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
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
                onClick={() => setShowRules(true)}
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
      {showRules && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">

            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                Safety is Our Priority
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                You must agree before creating an event.
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-700 max-h-[300px] overflow-y-auto">
              <p>• Do not organise unsafe or dangerous activities</p>
              <p>• Respect local laws and council regulations</p>
              <p>• Do not trespass on private property</p>
              <p>• Ensure participants have safe access to the area</p>
              <p>• Do not include misleading or false information</p>
              <p>• Keep events environmentally focused</p>
              <p>
                • Children under 13 <b>MUST NOT</b> create events
              </p>
              <p>
                • Clean Today may remove events that violate our guidelines
              </p>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />

              <span>
                I agree to the safety guidelines
              </span>
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRules(false)
                  setAgreed(false)
                }}
                className="px-4 py-2 rounded-lg border bg-red-700 text-white"
              >
                Cancel
              </button>

              <button
                disabled={!agreed || loading}
                onClick={async () => {
                  await createEvent()
                  setShowRules(false)
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  agreed
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}