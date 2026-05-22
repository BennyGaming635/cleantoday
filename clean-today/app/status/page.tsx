'use client'

import Navbar from '@/components/navbar/Navbar'

export default function StatusPage() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
                <div>
                    <h1 className="text-4xl font-bold text-green-900">
                        System Status
                        </h1>
                    <p className="text-gray-600 mt-2">
                        Live platform uptime, incidents and maintenance updates.
                    </p>
                </div>
                <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
                    <iframe
                        src="https://cleantoday.betteruptime.com/"
                        className="w-full h-[900px]"
                    />
                </div>
            </div>
        </main>
    )
}