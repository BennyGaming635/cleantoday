'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isaAdmin } from '@/lib/adminAuth'

export default function AdminGuard({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    useEffect(() => {
        if (!isaAdmin()) {
            router.push('/login')
        }
    }, [])

    if (!isaAdmin()) return null
    return <>{children}</>
}