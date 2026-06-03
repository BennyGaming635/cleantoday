import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'achievements',
    timestamp: new Date().toISOString(),
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const userId = body?.userId

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }

  const now = new Date()
  const cutoff = new Date('2026-08-01T00:00:00Z')

  const { data: events } = await supabaseAdmin
    .from('cleanup_events')
    .select('kg_collected')
    .eq('creator_id', userId)
    .eq('completed', true)

  const totalKg =
    events?.reduce((sum, e) => sum + Number(e.kg_collected || 0), 0) || 0

  const awards = []

  if (now < cutoff) {
    awards.push({
      user_id: userId,
      achievement_key: 'Beta_Tester',
      earned_at: now.toISOString(),
      desc: 'Joined during the beta phase',
    })
  }

  if (totalKg >= 10) {
    awards.push({
      user_id: userId,
      achievement_key: '10kg_Club',
      earned_at: now.toISOString(),
      desc: 'Collected 10kg of waste',
    })
  }

  if (awards.length === 0) {
    return NextResponse.json({ message: 'No achievements earned' })
  }

  const { error } = await supabaseAdmin
    .from('user_achievements')
    .upsert(awards, {
      onConflict: 'user_id,achievement_key',
    })

  if (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to award achievements', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: 'Achievements awarded',
    awards,
  })
}