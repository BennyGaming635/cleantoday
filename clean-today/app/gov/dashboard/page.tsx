'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import dynamic from 'next/dynamic'

const ReportWizard = dynamic(
  () => import('@/components/gov/ReportWizard'),
  { ssr: false }
)

type GovUser = {
  username: string
  council_name: string
  logo_url?: string
  theme_color?: string
}

type Event = {
  id: string
  title: string
  location_name: string
  completed: boolean
  kg_collected: number | null
  latitude: number | null
  longitude: number | null
  description?: string
  event_time?: string
  council_username: string | null
}

export default function GovDashboard() {
  const router = useRouter()

  const [govUser, setGovUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('gov_user')
    return stored ? JSON.parse(stored) : null
  })

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [wizardOpen, setWizardOpen] = useState(false)

  useEffect(() => {
    if (!govUser) {
      router.push('/gov/login')
      return
    }

    const loadData = async () => {
      const { data } = await supabase
        .from('cleanup_events')
        .select(
          'id, title, location_name, completed, kg_collected, latitude, longitude, council_username'
        )

      if (data) setEvents(data)
      setLoading(false)
    }

    loadData()
  }, [router, govUser])

  const totalKg = events.reduce(
    (sum, e) => sum + (e.kg_collected || 0),
    0
  )

  const totalEvents = events.length
  const completed = events.filter((e) => e.completed).length
  const upcoming = events.filter((e) => !e.completed).length

  const deleteEvent = async (eventId: string) => {
    const confirmed = confirm('Are you sure you want to delete this event?')
    if (!confirmed || !govUser) return

    const { error } = await supabase
      .from('cleanup_events')
      .delete()
      .eq('id', eventId)
      .eq('council_username', govUser.username)

      if (error) {
        alert('Failed to delete event. Please try again.')
        return
      }

      setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  const generateReport = (
    reportEvents: Event[],
    primaryColor: string,
    secondaryColor: string
  ) => {
    const doc = new jsPDF()

    doc.setTextColor(secondaryColor)
    doc.setFillColor(primaryColor)
    doc.rect(0, 0, 230, 35, 'F')

    doc.setFontSize(22)
    doc.text(
      `${govUser?.council_name} Environmental Impact Report`,
      14,
      20
    )

    doc.setFontSize(12)
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      14,
      30
    )

    doc.text(`Total Events: ${reportEvents.length}`, 14, 45)
    doc.text(
      `Completed: ${reportEvents.filter((e) => e.completed).length}`,
      14,
      55
    )
    doc.text(
      `Upcoming: ${reportEvents.filter((e) => !e.completed).length}`,
      14,
      65
    )
    doc.text(
      `Total Waste Collected: ${reportEvents.reduce(
        (sum, e) => sum + (e.kg_collected || 0),
        0
      )} kg`,
      14,
      75
    )

    autoTable(doc, {
      startY: 90,
      head: [['Title', 'Location', 'Status', 'KG']],
      body: reportEvents.map((e) => [
        e.title,
        e.location_name,
        e.completed ? 'Completed' : 'Upcoming',
        `${e.kg_collected || 0} kg`
      ])
    })

    doc.save('environmental_report.pdf')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center text-gray-800">
        <p>Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">

        <h1 className="text-4xl font-bold text-green-900">
          {govUser?.council_name || ' Dashboard'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Total Events</p>
            <p className="text-3xl font-bold text-blue-600">{totalEvents}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Completed</p>
            <p className="text-3xl font-bold text-green-700">{completed}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Upcoming</p>
            <p className="text-3xl font-bold text-blue-700">{upcoming}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Total Waste</p>
            <p className="text-3xl font-bold text-green-800">{totalKg} kg</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Create Event</p>
            <button
              onClick={() => router.push('/gov/dashboard/create')}
              className="mt-2 bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              New
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border text-gray-800">
            <p>Report</p>
            <button
              onClick={() => setWizardOpen(true)}
              className="mt-2 bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Cleanups</h2>

          {events.map((e) => (
            <div key={e.id} className="border-b py-3 flex justify-between">
              <div>
                <p className="font-semibold text-gray-800">{e.title}</p>
                <p className="text-sm text-gray-500">{e.location_name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-800">{e.completed ? 'Completed' : 'Upcoming'}</p>
                <p className="text-sm text-gray-600">
                  {e.kg_collected || 0} kg
                </p>
              </div>
              {e.council_username === govUser?.username && (
              <button
              onClick={() => deleteEvent(e.id)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Delete
            </button>
              )}
            </div>
          ))}
        </div>

        <ReportWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onGenerate={(data) => {
            const coords = data.polygon.map((p) => [p.lng, p.lat])
            coords.push(coords[0])

            const turfPolygon = polygon([coords])

            const filtered = events.filter((e) => {
              if (!e.latitude || !e.longitude) return false

              return booleanPointInPolygon(
                point([e.longitude, e.latitude]),
                turfPolygon
              )
            })

            generateReport(
              filtered,
              data.primaryColor,
              data.secondaryColor
            )

            setWizardOpen(false)
          }}
        />
      </div>
    </main>
  )
}