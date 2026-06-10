import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
    const { data } = await supabaseAdmin
        .from('cleanup_events')
        .select('*')
        .order('created_at', { ascending: false })

    return NextResponse.json(data)
}

export async function POST(req: Request) {
    const body = await req.json()

    if (body.action === 'delete') {
        await supabaseAdmin
            .from('cleanup_events')
            .delete()
            .eq('id', body.id)
    }

    if (body.action === 'complete') {
        await supabaseAdmin
            .from('cleanup_events')
            .update({ completed: true })
            .eq('id', body.id)
    }

    if (body.action === 'reopen') {
        await supabaseAdmin
            .from('cleanup_events')
            .update({ completed: false })
            .eq('id', body.id)
    }

    return NextResponse.json({ ok: true })
}