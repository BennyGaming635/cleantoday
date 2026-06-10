'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  event_time: string | null
  completed: boolean
  kg_collected: number | null
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] =
    useState('')
  const [editLocation, setEditLocation] =
    useState('')
  const [editDate, setEditDate] = useState('')
  const router = useRouter()

  const loadEvents = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('cleanup_events')
      .select(
        `
        id,
        title,
        description,
        location_name,
        event_time,
        completed,
        kg_collected
      `
      )
      .eq('creator_id', user.id)
      .order('event_time', {
        ascending: true,
      })

    if (!error && data) {
      setEvents(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/me')
      }
    }
    checkAuth()

    ;(async () => {
      await loadEvents()
    })()
  }, [])

  const deleteEvent = async (id: string) => {
    const confirmed = confirm(
      'Delete this event permanently?'
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

    setEvents((prev) =>
      prev.filter((event) => event.id !== id)
    )
  }

  const markComplete = async (id: string) => {
    const kgInput = prompt(
      'How many kilograms of waste were collected?'
    )

    if (!kgInput) return

    const kg = Number(kgInput)

    if (isNaN(kg)) {
      alert('Enter a valid number.')
      return
    }

    const { error } = await supabase
      .from('cleanup_events')
      .update({
        completed: true,
        kg_collected: kg,
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
              ...event,
              completed: true,
              kg_collected: kg,
            }
          : event
      )
    )
  }

  const openEdit = (event: Event) => {
    setEditingEvent(event)

    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditLocation(event.location_name)

    setEditDate(
      event.event_time
        ? new Date(event.event_time)
            .toISOString()
            .slice(0, 16)
        : ''
    )
  }

  const saveEdit = async () => {
    if (!editingEvent) return

    const { error } = await supabase
      .from('cleanup_events')
      .update({
        title: editTitle,
        description: editDescription,
        location_name: editLocation,
        event_time: editDate,
      })
      .eq('id', editingEvent.id)

    if (error) {
      alert(error.message)
      return
    }

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: editTitle,
              description: editDescription,
              location_name: editLocation,
              event_time: editDate,
            }
          : event
      )
    )

    setEditingEvent(null)
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold text-green-900">
              My Events
            </h1>

            <p className="text-gray-600 mt-3">
              Manage your community cleanups.
            </p>
          </div>

          <Link
            href="/create"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Create Event
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-600">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <div className="bg-white border rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              No events yet
            </h2>

            <p className="text-gray-500 mt-3">
              Start organising your first cleanup.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border rounded-3xl p-8 shadow-sm"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

                  <div className="space-y-4 flex-1">

                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {event.title}
                      </h2>

                      {event.completed ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-gray-500 text-sm">

                      <p>
                        📍 {event.location_name}
                      </p>

                      {event.event_time && (
                        <p>
                          📅{' '}
                          {new Date(
                            event.event_time
                          ).toLocaleString()}
                        </p>
                      )}

                      {event.completed && (
                        <p className="font-medium text-green-700">
                          ♻️{' '}
                          {event.kg_collected || 0}kg
                          collected
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <Link
                      href={`/event/${event.id}`}
                      className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white transition"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => openEdit(event)}
                      className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      Edit
                    </button>

                    {!event.completed && (
                      <button
                        onClick={() =>
                          markComplete(event.id)
                        }
                        className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white transition"
                      >
                        Mark Complete
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {editingEvent && (
        <div className="fixed inset-0 bg-black/40 z-[2000] flex items-center justify-center p-6">

          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 space-y-5">

            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Edit Event
              </h2>

              <p className="text-gray-500 mt-2">
                Update your cleanup details.
              </p>
            </div>

            <input
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Event title"
              className="w-full border rounded-2xl p-4 text-gray-800"
            />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              placeholder="Description"
              className="w-full border rounded-2xl p-4 min-h-[160px] text-gray-800"
            />

            <input
              value={editLocation}
              onChange={(e) =>
                setEditLocation(
                  e.target.value
                )
              }
              placeholder="Location"
              className="w-full border rounded-2xl p-4 text-gray-800"
            />

            <input
              type="datetime-local"
              value={editDate}
              onChange={(e) =>
                setEditDate(e.target.value)
              }
              className="w-full border rounded-2xl p-4 text-gray-800"
            />

            <div className="flex justify-end gap-4 pt-4">

              <button
                onClick={() =>
                  setEditingEvent(null)
                }
                className="px-5 py-3 rounded-2xl border hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-5 py-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white transition"
              >
                Save Changes
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
  )
}