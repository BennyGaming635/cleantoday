import Navbar from "@/components/navbar/Navbar"
import Link from "next/link"

export default function HomePage() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 py-28 space-y-20">

                <div className="space-y-8">
                    <h1 className="text-6xl font-bold text-green-800 leading-tight">
                        Organise community cleanups.
                    </h1>

                    <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
                        Find or create community cleanups near you and make real environmental impact with people around you.
                    </p>

                    <div className="flex gap-4">
                        <Link href="/explore" className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
                            Explore Events
                        </Link>

                        <Link href="/create" className="bg-white border border-green-200 text-green-800 px-6 py-3 rounded-xl font-semibold hover:bg-green-100 transition">
                            Create Event
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Find cleanups
                        </h3>
                        <p className="text-gray-600">
                            Discover nearby cleanups around you and see who else is attending in your area.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Join or RSVP
                        </h3>
                        <p className="text-gray-600">
                            Join events instantly to help clean together!
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-3">
                        <h3 className="text-lg font-semibold text-green-800">
                            Create impact
                        </h3>
                        <p className="text-gray-600">
                            Organise your own cleanup and bring your community together.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-green-800">
                        Why Clean Today?
                    </h2>

                    <p className="text-gray-700 max-w-3xl leading-relaxed">
                        Clean Today is built to ensure we Clean Today for a Cleaner Tomorrow. We are on a mission to empower communities to take action and make a real difference in keeping our environment clean and healthy.
                    </p>
                </div>

            </section>
        </main>
    )
}