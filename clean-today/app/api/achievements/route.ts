import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const body = await req.json()
  const userId = body?.userId

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  const cutoff = new Date('2026-08-01T00:00:00Z')

  if (new Date() < cutoff) {
    const { error } = await supabaseAdmin.from('user_achievements').upsert({
        user_id: userId,
        achievement_key: 'Beta_Tester',
        earned_at: new Date().toISOString(),
        desc: 'Joined during the beta phase',
        })

    if (error) {
  console.error('Supabase error:', error)

  return NextResponse.json(
    {
      error: 'Failed to award achievement',
      details: error.message,
    },
    { status: 500 }
  )
}
  }

  return NextResponse.json({ message: 'ok' })
}