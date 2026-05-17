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

type LatLng = {
  lat: number
  lng: number
}

export default function CreateZonePage() {
  const router = useRouter()

  const [govUser, setGovUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null

    const stored = localStorage.getItem('gov_user')
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationName, setLocationName] = useState('')

  const [polygon, setPolygon] = useState<LatLng[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!govUser) router.push('/gov/login')
  }, [govUser, router])

  const createZone = async () => {
    if (!govUser) return
    if (!title || !locationName || polygon.length < 3) return

    setLoading(true)

    const { error } = await supabase.from('gov_zones').insert({
      title,
      description,
      location_name: locationName,
      zone_polygon: polygon,
      created_by: govUser.username,
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
                Create Focus Zone
              </h1>
              <p className="text-gray-500 mt-1">
                Draw an area where the community should focus cleanup efforts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow space-y-4">

              <input
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Zone title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Location name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />

              <textarea
                className="w-full border p-3 rounded-lg text-gray-800"
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="text-sm text-gray-600">
                Points selected: {polygon.length}
                {polygon.length < 3 && (
                  <span className="text-red-500 ml-2">
                    (minimum 3 required)
                  </span>
                )}
              </div>

              <button
                onClick={createZone}
                disabled={loading || polygon.length < 3}
                className="w-full bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Focus Zone'}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-1/2 border-l">
          <CreateMap
            onSelect={(coords) => setPolygon(coords as unknown as LatLng[])}
          />
        </div>

      </div>
    </div>
  )
}