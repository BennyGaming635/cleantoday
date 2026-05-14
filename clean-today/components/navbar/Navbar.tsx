import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[1000] w-full border-b bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">
          Clean Today
        </h1>

        <div className="flex gap-6 text-sm font-medium text-green-700">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/create">Create Event</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}