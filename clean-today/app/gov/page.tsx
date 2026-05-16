import Navbar from '@/components/navbar/Navbar'

export default function GovPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Navbar />
            <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-6">
                        Government & Council Partnerships
                </div>

                <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                    Community cleanup insights for governments and councils.
                </h1>
                <p className="text-xl text-gray-600 mt-8 leading-relaxed max-w-3xl">
                    Clean Today helps councils and government organisations
                    understand cleanup activity, identify focus areas,
                    measure environmental impact, and engage communities
                    in local sustainability initiatives.
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                    <a
                        href="mailto:rjhj8647@gmail.com"
                        className="bg-green-700 hover:bg-green-800 text-white px-7 py-4 rounded-2xl font-semibold transition"
                    >
                        Get in Touch
                    </a>
                    <a
                        href="/explore"
                        className="bg-white border border-green-200 hover:bg-green-50 text-green-800 px-7 py-4 rounded-2xl font-semibold transition"
                    >
                        Explore Community Activity
                    </a>
                </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <div className="text-4xl mb-5">📍</div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Focus Areas
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            Identify suburbs, parks, beaches, and public spaces
                            receiving high levels of community cleanup activity
                            or requiring more attention.
                        </p>
                    </div>
                    <div className="bg-white border rounded-3xl p-8 shadow-sm">
                        <div className="text-4xl mb-5">📊</div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Environmental Impact
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Track waste collected, volunteer participation,
                            recurring cleanup zones, and long-term environmental
                            improvements across regions.
                        </p>
                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 pb-28">
                <div className="bg-green-700 rounded-[2rem] p-10 md:p-16 text-white">

                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-bold mb-6">
                            Interested in partnering with Clean Today?
                        </h2>
                    <p className="text-green-100 text-lg leading-relaxed mb-8">
                        We are currently exploring partnerships with councils,
                        environmental agencies, and government bodies
                        looking to better understand and support community-led
                        envrionmental initatives.
                    </p>

                    <a
                    href="mailto:rjhj8647@gmail.com"
                    className="inline-flex bg-white text-green-800 px-6 py-4 rounded-2xl font-semibold hover:bg-green-50 transition"
                    >
                        Email our team
                    </a>
                    </div>
                </div>
            </section>
        </main>
    )
}