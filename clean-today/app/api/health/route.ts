import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { error } = await supabase
      .from('cleanup_events')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      {
        status: 'error',
      },
      { status: 500 }
    )
  }
}