'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/admin/AdminGuard'
import { logoutAdmin } from '@/lib/adminAuth'

export default function AdminDashboard() {
  type Event = {
    id: string
    title: string
    location_name: string
    completed?: boolean
    kg_collected?: number
  }
    const [events, setEvents] = useState<Event[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('cleanup_events')
      .select('*')

    setEvents(data || [])
  }

  useEffect(() => {
    const init = async () => {
        await load()
    }
    init()
  }, [])

  const deleteEvent = async (id: string) => {
    await supabase.from('cleanup_events').delete().eq('id', id)
    load()
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-700">
            Admin Dashboard
          </h1>

          <button
            onClick={logoutAdmin}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-xl p-4 flex justify-between text-gray-800"
            >
              <div>
                <p className="font-bold">{event.title}</p>
                <p className="text-sm text-gray-500">
                  {event.location_name}
                </p>
              </div>

              <button
                onClick={() => deleteEvent(event.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  )
}