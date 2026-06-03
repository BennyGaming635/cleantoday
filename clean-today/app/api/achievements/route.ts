import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    const { error } = await supabase.from('user_achievements').upsert({
      user_id: userId,
      achievement_key: 'beta_tester',
      earned_at: new Date().toISOString(),
      desc: 'Joined during the beta phase',
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to award achievement' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ message: 'ok' })
}