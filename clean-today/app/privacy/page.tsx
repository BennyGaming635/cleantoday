'use client'

import Navbar from '@/components/navbar/Navbar'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border p-8 md:p-12 space-y-8">

          <div>
            <h1 className="text-4xl font-bold text-green-800">
              Privacy Policy
            </h1>

            <p className="text-gray-500 mt-3">
              Last updated: May 21, 2026
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Overview
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Clean Today values your privacy and is committed to
              protecting your information. This Privacy Policy explains
              what data we collect, how we use it, and who it may be
              shared with when you use Clean Today.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Information We Collect
            </h2>

            <div className="space-y-2 text-gray-700">
              <p>
                When you create an account using Google or GitHub sign
                in, we may collect:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Username</li>
                <li>Email address</li>
                <li>Profile picture</li>
              </ul>

              <p>
                We also collect information created through your use of
                the platform, including:
              </p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Public cleanup events</li>
                <li>Comments and posts</li>
                <li>RSVPs to events</li>
                <li>Event location information</li>
              </ul>

              <p>
                Clean Today does not store live or background user
                location data.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Cookies and Analytics
            </h2>

            <div className="space-y-2 text-gray-700">
              <p>
                We use cookies and analytics technologies to improve the
                platform and understand usage.
              </p>

              <p>Services used include:</p>

              <ul className="list-disc pl-6 space-y-1">
                <li>Supabase authentication cookies</li>
                <li>Google Analytics</li>
                <li>Vercel Analytics</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              How We Use Information
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To provide and operate Clean Today</li>
              <li>To manage user accounts and authentication</li>
              <li>To allow users to create and manage events</li>
              <li>To display public community content</li>
              <li>To improve the platform and monitor performance</li>
              <li>
                To provide reporting tools for affiliated councils and
                governments
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Government and Council Access
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Councils and government organisations that become
              affiliated with Clean Today may receive access to tools
              and reports that summarise public cleanup activity within
              selected areas. These reports can include event summaries,
              event locations, and cleanup statistics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Third-Party Services
            </h2>

            <p className="text-gray-700">
              Clean Today relies on third-party services to operate the
              platform, including:
            </p>

            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Vercel</li>
              <li>Supabase</li>
              <li>Google</li>
              <li>GitHub</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Account Deletion
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Users may request deletion of their account and content by
              contacting us using the email address listed below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Age Requirements
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Clean Today is not intended for users under the age of 13.
              Users under 13 are not permitted to create accounts or
              use account-based features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              Contact
            </h2>

            <p className="text-gray-700">
              If you have questions about this Privacy Policy or would
              like to request account deletion, contact:
            </p>

            <p className="font-medium text-green-700">
              rjhj8647@gmail.com
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}