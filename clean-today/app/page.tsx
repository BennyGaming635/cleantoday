import Navbar from "@/components/navbar/Navbar";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />

            <section className="max-w-7x1 mx-auto px-6 py-24">
                <h1 className="text-6xl font-bold text-green-800 mb-6">
                    Orangise community cleanups.
                </h1>

                <p className="text-xl text-gray-700 max-w-2xl mb-8">
                    Find or create community cleanups near you.
                </p>

                <button className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition">
                    Explore Events
                </button>
            </section>
        </main>
    )
}