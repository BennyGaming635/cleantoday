'use client'

import dynamic from 'next/dynamic'

const CleanupMap = dynamic(
    () => import('@/components/map/CleanupMap'),
    { ssr: false }
)

export default function ExplorePage() {
    return (
        <main className="h-screen w-screen overflow-hidden">
            <CleanupMap />
        </main>
    )
}