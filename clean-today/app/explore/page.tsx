'use client'

import dynamic from 'next/dynamic'
import Navbar from '@/components/navbar/Navbar'

const CleanupMap = dynamic(
  () => import('@/components/map/CleanupMap'),
  { ssr: false }
)

export default function ExplorePage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Navbar />

      <div className="h-[calc(100vh-73px)] w-full">
        <CleanupMap />
      </div>
    </main>
  )
}