'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/navbar/Navbar'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  event_time: string | null
  creator_id: string
  completed: boolean
  kg_collected: number
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setEvents([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('cleanup_events')
      .select('*')
      .eq('creator_id', user.id)
      .order('event_time', { ascending: true })

    if (!error && data) {
      setEvents(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      await loadEvents()
    }
    
    init()
  }, [])

  const deleteEvent = async (id: string) => {
    const confirmed = confirm(
      'Are you sure you want to delete this event?'
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('cleanup_events')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    loadEvents()
  }

  const completeEvent = async (eventId: string) => {
    const input = prompt(
      'How many kilograms of waste were collected?'
    )

    if (!input) return

    const kg = Number(input)

    if (isNaN(kg)) {
      alert('Please enter a valid number.')
      return
    }

    const { error } = await supabase
      .from('cleanup_events')
      .update({
        completed: true,
        kg_collected: kg,
      })
      .eq('id', eventId)

    if (error) {
      alert(error.message)
      return
    }

    loadEvents()
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-green-800">
              My Events
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your community cleanups
            </p>
          </div>

          <Link
            href="/create"
            className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold transition w-fit"
          >
            Create Event
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border p-8">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No events yet
            </h2>

            <p className="text-gray-600 mb-6">
              Start organising your first community cleanup.
            </p>

            <Link
              href="/create"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border rounded-2xl p-6 shadow-sm space-y-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/event/${event.id}`}
                        className="text-2xl font-bold text-green-800 hover:underline"
                      >
                        {event.title}
                      </Link>

                      {event.completed ? (
                        <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-1 text-sm text-gray-500">
                      <p>📍 {event.location_name}</p>

                      {event.event_time && (
                        <p>
                          📅{' '}
                          {new Date(
                            event.event_time
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[220px]">
                    {!event.completed ? (
                      <button
                        onClick={() =>
                          completeEvent(event.id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition"
                      >
                        Mark Complete
                      </button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="font-semibold text-green-700">
                          Cleanup Complete
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          {event.kg_collected}kg collected
                        </p>
                      </div>
                    )}

                    <Link
                      href={`/event/${event.id}`}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl font-medium transition text-center"
                    >
                      View Event
                    </Link>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition"
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}