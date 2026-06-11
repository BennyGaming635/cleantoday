import Navbar from '@/components/navbar/Navbar'
import Link from 'next/link'

const posts = [
    {
        title: 'Welcome to Clean Today',
        slug: 'welcome',
        excerpt: 'What is Clean Today and how can you get involved?'
    },
]

export default function Blog() {
    return (
        <main className="min-h-screen bg-green-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Clean Today Blog
                </h1>
                <div className="grid md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="bg-white border rounded-3xl p-6 hover:shadow-md transition"
                        >
                            <h2 className="text-2xl font-semibold text-green-700">
                                {post.title}
                            </h2>
                            <p className="text-gray-600 mt-2">
                                {post.excerpt}
                            </p>
                            <p className="text-green-700 mt-4 text-sm">
                                Read more »
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    )
}