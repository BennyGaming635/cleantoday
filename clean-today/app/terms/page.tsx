'use client'

import Navbar from '@/components/navbar/Navbar'

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-3xl shadow-sm border p-8 md:p-12 space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-green-800">
                            Terms and Conditions
                        </h1>
                        <p className="text-gray-500 mt-3">
                            Last updated: June 9, 2026
                        </p>
                    </div>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Acceptance of Terms
                        </h2>
                        <p className="text-gray-700 leading-7">
                            By using Clean Today, you agree to these Terms &
                            Conditions. If you do not agree, discontinue
                            use of our services immediately.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Eligibility
                        </h2>
                        <p className="text-gray-700 leading-7">
                            You must be at least 13 years old to use our services,
                            including Clean Today. By creating an account, you
                            confirm that you meet this age requirement.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            User accounts
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Accounts are required to create events, RSVP to
                            events, and create community posts. Users may sign
                            in using supported providers such as GitHub or
                            Google.
                        </p>
                        <p className="text-gray-700 leading-7">
                            You are responsible for maintaining the security of
                            your account and for any activity performed under
                            your account.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Community Rules
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Users must not:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Post illegal, harmful, or offensive content</li>
                            <li>Impersonate other people or organisations</li>
                            <li>Spam events, comments or posts</li>
                            <li>Upload misleading or false information</li>
                            <li>Attempt to disrupt or damage our services</li>
                        </ul>

                        <p className="text-gray-700 leading-7">
                            Clean Today may remove content or suspend accounts
                            that violate these rules.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            User Content
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Users may create public events, comments and posts.
                            By submitting content, you grant Clean Today
                            permission to use, display, and distribute your
                            content via our services.
                        </p>
                        <p className="text-gray-700 leading-7">
                            You remain responsible for the content you post.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Government and Council Features
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Clean Today offers verified councils and governments
                            the ability to access reporting tools, cleanup
                            summaries and event information for selected areas.
                        </p>
                        <p className="text-gray-700 leading-7">
                            Access to these features is granted manually via
                            the Clean Today team.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Availability
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Clean Today is provided on an &quot;as is&quot; basis. We do
                            not guarantee uninterrupted access or error-free services.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Limitation of Liability
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Clean Today is not responsible for user-created
                            content, third-party services, event safety, or any
                            damages resulting from use of the platform.
                            Users attend events at their own risk.
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Account Deletion
                        </h2>
                        <p className="text-gray-700 leading-7">
                            Users may request account or content deletion by
                            contacting:
                        </p>
                        <p className="text-green-700 font-medium">
                            rjhj8647@gmail.com
                        </p>
                    </section>
                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Changes to These Terms
                        </h2>
                        <p className="text-gray-700 leading-7">
                            These Terms & Conditions may be updated over time.
                            Continued use of Clean Today after changes are made
                            means you accept the updated terms. We will notify
                            users of changes to the terms via a notice on our
                            platform 14 days before they take effect.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}