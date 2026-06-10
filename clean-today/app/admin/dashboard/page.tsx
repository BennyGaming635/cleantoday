'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/admin/AdminGuard'
import { logoutAdmin } from '@/lib/adminAuth'

type Event = {
  id: string
  title: string
  location_name: string
  completed?: boolean
  kg_collected?: number
  creator_id?: string
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('cleanup_events')
      .select('*')
      .order('created_at', { ascending: false })

    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => {
    void (async () => {
      await load()
    })()
  }, [])

  const deleteEvent = async (id: string) => {
    await supabase.from('cleanup_events').delete().eq('id', id)
    load()
  }

  const markComplete = async (id: string) => {
    await supabase
      .from('cleanup_events')
      .update({ completed: true })
      .eq('id', id)

    load()
  }

  const markActive = async (id: string) => {
    await supabase
      .from('cleanup_events')
      .update({ completed: false })
      .eq('id', id)

    load()
  }

  const totalKg = events.reduce(
    (sum, e) => sum + Number(e.kg_collected || 0),
    0
  )

  const completedCount = events.filter(e => e.completed).length

  return (
    <AdminGuard>
      <div className="min-h-screen bg-green-50 p-6 space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Control centre for Clean Today
            </p>
          </div>

          <button
            onClick={logoutAdmin}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Total Events</p>
            <p className="text-3xl font-bold text-gray-800">
              {events.length}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Completed Events</p>
            <p className="text-3xl font-bold text-green-700">
              {completedCount}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-gray-500 text-sm">Total Waste Collected</p>
            <p className="text-3xl font-bold text-green-700">
              {totalKg} kg
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">
              All Events
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : (
            <div className="divide-y">
              {events.map(event => (
                <div
                  key={event.id}
                  className="p-4 flex justify-between items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">
                        {event.title}
                      </p>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {event.completed ? 'Completed' : 'Active'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {event.location_name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {event.kg_collected || 0} kg
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!event.completed ? (
                      <button
                        onClick={() => markComplete(event.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => markActive(event.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}