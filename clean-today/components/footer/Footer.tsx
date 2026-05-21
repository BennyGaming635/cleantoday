'use client'

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-white mt-24">
            <div className="max-w-7xl mx-auto px-6 py-10 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Platform
                        </h3>

                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="/">Home</Link>
                            <Link href="/explore">Explore Events</Link>
                            <Link href="/create">Create Event</Link>
                            <Link href="/dashboard">Dashboard</Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Community
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="/profile">My Profile</Link>
                            <Link href="/users">Users</Link>
                            <Link href="/milestones">Milestones</Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Government
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="/gov">Government Enquires</Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Admin
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="/admin">Dashboard</Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Legal
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <Link href="/terms">Terms & Conditions</Link>
                            <Link href="/privacy">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        2026 Clean Today.
                        <br></br>
                        A <b>Cleaner Today</b> for a better Tomorrow.
                    </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <Link href="/">Home</Link>
                    <Link href="/explore">Explore</Link>
                    <Link href="/gov">Government</Link>
                    <Link href="/users">Users</Link>
                    <Link href="/terms">Terms & Conditions</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                </div>
            </div>
            </div>
        </footer>
    )
}