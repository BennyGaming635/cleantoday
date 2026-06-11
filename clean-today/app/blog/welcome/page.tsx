import Navbar from '@/components/navbar/Navbar'
import Link from 'next/link'

export default function WelcomeBlog() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Clean Today
          </h1>

          <p className="text-sm text-gray-500">
            Building cleaner communities, together
          </p>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Welcome to Clean Today — a platform built to help communities
            organise, join, and track real-world cleanup events.
          </p>

          <p>
            Our goal is simple: make it easier for people to take action
            and see the real environmental impact they’re creating.
          </p>

          <p>
            Whether you’re joining your first cleanup or organising events
            in your local area, Clean Today helps you stay connected and motivated.
          </p>

          <p>
            Every event contributes to a larger picture like kilograms of waste removed,
            communities engaged, and local environments improved.
          </p>
        </div>

        <div className="bg-white border rounded-3xl p-6 space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            What you can do here
          </h2>

          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Find cleanup events near you</li>
            <li>Join and RSVP in one click</li>
            <li>Create your own community cleanups</li>
            <li>Track your impact over time</li>
            <li>Earn badges as you contribute</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-3xl p-6 space-y-3">
          <h2 className="text-xl font-bold text-green-800">
            Start your journey
          </h2>

          <p className="text-green-700">
            Explore upcoming cleanups or create your first event today.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/explore"
              className="bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
            >
              Explore Events
            </Link>

            <Link
              href="/create"
              className="bg-white border border-green-200 text-green-800 px-5 py-2 rounded-xl font-semibold"
            >
              Create Event
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Clean Today • Community-driven environmental action
        </p>

      </div>
    </main>
  )
}