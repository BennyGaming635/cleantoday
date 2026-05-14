import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white">
            <div className="max-w-7x1 mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-green-700">
                    Clean Today
                </h1>

                <div className="flex gap-6 text-sm font-medium">
                    <Link href="/">Home</Link>
                    <Link href="/explore">Explore</Link>
                    <Link href="/create">Create</Link>
                    <Link href="/dashboard">Dashboard</Link>
                </div>
            </div>
        </nav>
    )
}