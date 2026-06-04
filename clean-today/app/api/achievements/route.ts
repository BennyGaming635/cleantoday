import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  return Response.json({
    status: '',
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
    .select('kg_collected, event_time')
    .eq('creator_id', userId)
    .eq('completed', true)

  const { count: hostedEvents } = await supabaseAdmin
    .from('cleanup_events')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', userId)

  const totalKg =
    events?.reduce((sum, e) => sum + Number(e.kg_collected || 0), 0) || 0

  const completedCleanupCount = events?.length || 0

  const hasJuneCleanup = events?.some((e) => {
    const d = new Date(e.event_time)
    return d.getUTCMonth() === 5
  })

  const hasSeptemberCleanup = events?.some((e) => {
    const d = new Date(e.event_time)
    return d.getUTCMonth() === 8
  })

  const hasNovemberCleanup = events?.some((e) => {
    const d = new Date(e.event_time)
    return d.getUTCMonth() === 10
  })

  const awards = []

  if ((hostedEvents ?? 0) >= 1) {
    awards.push({
      user_id: userId,
      achievement_key: 'First_Host',
      earned_at: now.toISOString(),
      desc: 'Hosted your first cleanup event',
    })
  }

  if (hasJuneCleanup) {
    awards.push({
      user_id: userId,
      achievement_key: 'Pride_Month',
      earned_at: now.toISOString(),
      desc: 'Completed a cleanup event in June (Pride Month)',
    })
  }

  if (hasSeptemberCleanup) {
    awards.push({
      user_id: userId,
      achievement_key: 'Honey_Month',
      earned_at: now.toISOString(),
      desc: 'Completed a cleanup event in the month of Honey!',
    })
  }

  if (hasNovemberCleanup) {
    awards.push({
      user_id: userId,
      achievement_key: 'Movember',
      earned_at: now.toISOString(),
      desc: 'Completed a cleanup event during the month of the Mowstache',
    })
  }

  if (completedCleanupCount >= 1) {
    awards.push({
      user_id: userId,
      achievement_key: 'First_Cleanup',
      earned_at: now.toISOString(),
      desc: 'Completed your first cleanup event',
    })
  }

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

  if (totalKg >= 50) {
    awards.push({
      user_id: userId,
      achievement_key: '50kg_Cleaner',
      earned_at: now.toISOString(),
      desc: 'Collected 50kg of waste',
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