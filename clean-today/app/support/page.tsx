'use client'

import Navbar from "@/components/navbar/Navbar"
import Link from "next/link"

export default function Support() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div className="bg=white rounded-xl p-6">
                    <h1 className="text-3xl font-bold text-green-700">
                        Support Clean Today
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Clean Today is a free platform and will always be free. Your support helps fund
                        hosting, new features, and community cleanup tools.
                    </p>
                </div>
                <div className="bg-white border rounded-xl p-6 space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Where does my money go?
                    </h2>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                        <li>Hosting & server costs</li>
                        <li>Building new features (maps, badges, leaderboards etc)</li>
                        <li>Community outreach & education</li>
                        <li>Improving event tools for our communities</li>
                        <li>Scaling Clean Today for the future!</li>
                        <li>Plus more!</li>
                    </ul>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white p-6">
                    <h2 className="text-xl font-bold">
                        Every contribution helps
                    </h2>
                    <p className="mt-2 text-white/90">
                        Even small donations help keep Clean Today free for everyone.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <a
                            href=""
                            target="_blank"
                            className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold"
                        >
                            Donate Today
                        </a>
                        <Link
                            href="/create"
                            className="border border-white px-4 py-2 rounded-lg"
                        >
                            Host a cleanup instead
                        </Link>
                    </div>
                </div>
                <div className="bg-white border rounded-xl p-6 text-sm text-gray-600">
                    We believe in transparency. Clean Today is a community project focused
                    on environmental impact, not profit. All contribution go directly
                    towards platform sustainability and growth.
                    </div>
                </div>
        </main>
    )
}