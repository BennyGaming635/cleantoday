import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const { data: event } = await supabase
    .from('cleanup_events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    return new Response('Not found', { status: 404 })
  }

  const isCouncil = !!event.council_username

 return new ImageResponse(
  (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 60,
        background: 'linear-gradient(135deg, #16a34a, #14532d)',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
        {isCouncil && (
          <div
            style={{
              position: 'absolute',
              top: 40,
              right: 40,
              fontSize: 28,
              background: 'rgba(255,255,255,0.2)',
              padding: '10px 16px',
              borderRadius: 12,
            }}
          >
            Council Event
          </div>
        )}

        <div style={{ fontSize: 64, fontWeight: 800 }}>
          {event.title}
        </div>

        <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9 }}>
          {`📍 ${event.location_name}`}
        </div>

        <div style={{ fontSize: 28, marginTop: 10, opacity: 0.8 }}>
          {event.event_time
            ? `🕒 ${new Date(event.event_time).toLocaleString()}`
            : '🕒 No time set'}
        </div>

        <div style={{ fontSize: 28, marginTop: 30 }}>
          {event.description?.slice(0, 120)}
        </div>

        <div style={{ marginTop: 50, fontSize: 24, opacity: 0.8 }}>
          Clean Today • Join a cleanup near you
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}