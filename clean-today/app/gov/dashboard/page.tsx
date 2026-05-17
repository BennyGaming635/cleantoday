'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point, polygon } from '@turf/helpers'
import dyanmic from 'next/dynamic'

const ReportWizard = dyanmic(
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
}

export default function GovDashboard() {
  const router = useRouter()
  const [wizardOpen, setWizardOpen] = useState(false)

  const [govUser, setGovUser] = useState<GovUser | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('gov_user')
    return stored ? (JSON.parse(stored) as GovUser) : null
  })
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!govUser) {
      router.push('/gov/login')
      return
    }

    const loadData = async () => {
      const { data } = await supabase
        .from('cleanup_events')
        .select(
          'id, title, location_name, completed, kg_collected, latitude, longitude'
        )

      if (data) setEvents(data)
      setLoading(false)
    }

    loadData()
  }, [router])

  const totalKg = events.reduce(
    (sum, e) => sum + (e.kg_collected || 0),
    0
  )

  const totalEvents = events.length

  const completed = events.filter(
    (e) => e.completed
  ).length

  const upcoming = events.filter(
    (e) => !e.completed
  ).length

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
    doc.text(`Completed: ${reportEvents.filter((e) => e.completed).length}`, 14, 55)
    doc.text(`Upcoming: ${reportEvents.filter((e) => !e.completed).length}`, 14, 65)
    doc.text(`Total Waste Collected: ${reportEvents.reduce((sum, e) => sum + (e.kg_collected || 0), 0)} kg`, 14, 75)

    autoTable(doc, {
      startY: 90,
      head: [['Title', 'Location', 'Status', 'KG']],
      headStyles: {
        fillColor: primaryColor,
        textColor: secondaryColor,
      },
      body: reportEvents.map((e) => [
        e.title,
        e.location_name,
        e.completed ? 'Completed' : 'Upcoming',
        `${e.kg_collected || 0} kg`
      ]),
    })

    doc.save('environmental_report.pdf')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-10">

        <div>
          <h1
            suppressHydrationWarning
            className="text-4xl font-bold text-green-900"
          >
            {govUser?.council_name ||
              'Government Dashboard'}
          </h1>

          <p className="text-gray-600 mt-2">
            Environmental impact analytics overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Total Events</p>
            <p className="text-3xl font-bold text-blue-300">
              {totalEvents}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-700">
              {completed}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-blue-700">
              {upcoming}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Total Waste (kg)</p>
            <p className="text-3xl font-bold text-green-800">
              {totalKg}
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500">Generate Report</p>
            <button
              onClick={() => setWizardOpen(true)}
              className="mt-2 bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Report
            </button>
          </div>

        </div>
        <div className="bg-white border rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            All Cleanups
          </h2>

          <div className="space-y-4">
            {events.map((e) => (
              <div
                key={e.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {e.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {e.location_name}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={
                      e.completed
                        ? 'text-red-600 font-medium'
                        : 'text-green-600 font-medium'
                    }
                  >
                    {e.completed
                      ? 'Completed'
                      : 'Upcoming'}
                  </p>

                  <p className="text-sm text-gray-500">
                    {e.kg_collected || 0} kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ReportWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGenerate={(data) => {
          const coords = data.polygon.map((p) => [
            p.lng,
            p.lat,
          ])

          coords.push(coords[0])

          const polygonCoords = [coords]

          const turfPolygon = polygon(polygonCoords)
          const filteredEvents = events.filter((event) => {
            if (
              event.latitude === null ||
              event.longitude === null
            ) {
              return false
            }

            const eventPoint = point([
              event.longitude,
              event.latitude,
            ])

            return booleanPointInPolygon(
              eventPoint,
              turfPolygon
            )
        })
        
        generateReport(
          filteredEvents,
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