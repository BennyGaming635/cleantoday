'use client'

import Navbar from '@/components/navbar/Navbar'

export default function SafetyPage() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
                <div>
                    <h1 className="text-4xl font-bold text-green-900">
                        Event Safety Guidelines
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Clean Today is built for and around, safe and community-led clean ups.
                        Please follow these guidelines to protect yourself, the community,
                        and the environment.
                    </p>
                </div>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        1. Personal Protective Equipment (PPE)
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Wear gloves at all times while collecting rubbish, dont know what it is</li>
                        <li>Wear closed-toe shoes or boots</li>
                        <li>Consider high-visibility clothing near roads, like a Hi-Vis vest</li>
                        <li>Bring hand sanitiser or wipes for after cleaning</li>
                    </ul>
                </section>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        2. Hazardous Materials
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>DO NOT handle needles, medical waste, or unknown hazardous materials</li>
                        <li>Avoid chemicals, powders, or leaking containers</li>
                        <li>Report hazardous materials to your organiser or local council</li>
                        <li>Do not attempt to move large or heavy objects alone</li>
                    </ul>
                </section>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        3. Location Safety
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Do not enter private property without permission</li>
                        <li>Avoid unsafe terrain such as unstable ground or water</li>
                        <li>Stay aware of traffic when cleaning around roads</li>
                        <li>Work in groups whenever possible</li>
                    </ul>
                </section>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        4. Weather and the Environment
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Cancel or postpone events in extreme weather conditions</li>
                        <li>Stay hydrated and take breaks in hot weather</li>
                        <li>Avoid cleaning in wet or icy conditions</li>
                        <li>Use sunscreen for outdoor events</li>
                    </ul>
                </section>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        5. For Organisers
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>Provide clear meeting points and instructions</li>
                        <li>Ensure participants understand safety rules</li>
                        <li>Have a basic first aid kit available if possible</li>
                        <li>Report incidents or hazards when they occur</li>
                    </ul>
                </section>
                <section className="bg-white border rounded-2xl p-6 space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        6. In an emergency
                    </h2>
                    <p className="text-gray-700">
                        In an emergency, contact your local emergency services ASAP.
                        Always prioritise personal safety over your cleanup efforts.
                    </p>
                </section>
                <div className="text-sm text-gray-500 text-center">
                    Please remember that <b>Clean Today</b> does not supervise events directly.
                    <br></br>
                    Participants and organisers are responsible for their own safety
                    and should use their best judgement.
                </div>
            </div>
        </main>
    )
}