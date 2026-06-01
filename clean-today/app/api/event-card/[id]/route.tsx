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
  const origin = req.nextUrl.origin

  const { data: event } = await supabase
    .from('cleanup_events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) {
    return new Response('Not found', { status: 404 })
  }

  const isCouncil = !!event.council_username

  let organiser = null

  if (event.creator_id) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', event.creator_id)
      .single()
    organiser = data
  } else if (event.council_username) {
    const { data } = await supabase
      .from('gov_accounts')
      .select('username, avatar_url')
      .eq('username', event.council_username)
      .single()
    organiser = data
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 60,
          background: 'linear-gradient(135deg, #16a34a, #14532d)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingRight: 40,
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

          <div style={{ fontSize: 64, fontWeight: 800 }}>{event.title}</div>

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

          {organiser && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 40,
              }}
            >
              <img
                src={organiser.avatar_url}
                alt={organiser.username}
                width={40}
                height={40}
                style={{
                  borderRadius: '9999px',
                  objectFit: 'cover',
                  border: '3px solid white',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 20, opacity: 0.8 }}>Organised by</div>

                <div style={{ fontSize: 28, fontWeight: 700 }}>
                  {organiser.username}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 50, fontSize: 24, opacity: 0.8 }}>
            Clean Today • Join a cleanup near you
          </div>
        </div>

        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: 14,
            overflow: 'hidden',
            border: '4px solid rgba(255,255,255,0.25)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            display: 'flex',
          }}
        >
          <img
            src={`${origin}/colouri.png`}
            alt="colouri preview"
            width={210}
            height={210}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
