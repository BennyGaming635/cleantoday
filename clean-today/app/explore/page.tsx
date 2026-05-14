import Navbar from '@/components/navbar/Navbar';
import dynamic from 'next/dynamic';

const CleanupMap = dynamic(
    () => import('@/components/map/CleanupMap'),
    {
        ssr: false,
    }
)

export default function ExplorePage() {
    return (
        <main className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-6">
                    Explore Cleanup Events
                </h1>
                <CleanupMap />
            </div>
        </main>
    )
}