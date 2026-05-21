'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number | null
  longitude: number | null
  creator_id: string | null
  event_time: string | null
  completed: boolean
  kg_collected: number | null
  council_username: string | null
}

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string
}

type AttendeeProfile = {
  id: string
  username: string
  avatar_url: string
}

type EventPost = {
  id: string
  content: string
  image_url: string | null
  user_id: string
  created_at: string
  profile?: {
    username: string
    avatar_url: string
  }
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()

  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [creator, setCreator] = useState<Profile | null>(null)

  const [userId, setUserId] = useState<string | null>(null)

  const [rsvps, setRsvps] = useState<string[]>([])
  const [attendees, setAttendees] = useState<AttendeeProfile[]>([])

  const [posts, setPosts] = useState<EventPost[]>([])
  const [postContent, setPostContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const isCouncilEvent = (event: Event) => !!event.council_username

  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const load = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUserId(user?.id ?? null)

    const { data: eventData } = await supabase
      .from('cleanup_events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (!eventData) {
      setLoading(false)
      return
    }

    setEvent(eventData)

    let creatorData = null

    if (eventData.creator_id) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', eventData.creator_id)
        .single()

      creatorData = data
    } else if (eventData.council_username) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', eventData.council_username)
        .single()

      creatorData = data
    }

    setCreator(creatorData)

    const { data: rsvpData } = await supabase
      .from('event_rsvps')
      .select('user_id')
      .eq('event_id', eventId)

    const attendeeIds = rsvpData?.map((r) => r.user_id) || []
    setRsvps(attendeeIds)

    if (attendeeIds.length > 0) {
      const { data: attendeeProfiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', attendeeIds)

      setAttendees(attendeeProfiles || [])
    }

    const { data: postsData } = await supabase
      .from('event_posts')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (postsData?.length) {
      const userIds = postsData.map((p) => p.user_id)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds)

      const merged = postsData.map((post) => ({
        ...post,
        profile: profileData?.find((p) => p.id === post.user_id),
      }))

      setPosts(merged)
    }

    setLoading(false)
  }

  useEffect(() => {
    (async () => {
      try {
        await load()
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  const isGoing = userId ? rsvps.includes(userId) : false

  const toggleRsvp = async () => {
    if (!event) return

    if (event.completed) return

    if (!userId) {
      router.push('/login')
      return
    }

    if (isGoing) {
      await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', userId)

      setRsvps((prev) => prev.filter((u) => u !== userId))
      setAttendees((prev) => prev.filter((a) => a.id !== userId))
    } else {
      await supabase.from('event_rsvps').insert({
        event_id: event.id,
        user_id: userId,
      })

      setRsvps((prev) => [...prev, userId])

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single()

      if (profile) {
        setAttendees((prev) => [...prev, profile])
      }
    }
  }

  const deleteEvent = async () => {
    if (!event) return

    const confirmed = confirm('Delete this event?')
    if (!confirmed) return

    await supabase.from('cleanup_events').delete().eq('id', event.id)
    router.push('/explore')
  }

  const createPost = async () => {
    if (!userId || !event) {
      router.push('/login')
      return
    }

    if (!postContent.trim() && !imageFile) return

    setPosting(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${ext}`

        const { error } = await supabase.storage
          .from('event-images')
          .upload(fileName, imageFile)

        if (error) throw error

        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)

        imageUrl = data.publicUrl
      }

      await supabase.from('event_posts').insert({
        event_id: event.id,
        user_id: userId,
        content: postContent,
        image_url: imageUrl,
      })

      setPostContent('')
      setImageFile(null)
      await load()
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-6">Event not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <h1 className="text-4xl font-bold text-green-700 flex items-center gap-2">
              {event.title}

              {event.council_username && (
                <img
                  src="/badge.svg"
                  alt="Council Event"
                  className="w-5 h-5"
                />
              )}
            </h1>

            <p className="text-gray-500">📍 {event.location_name}</p>

            <p className="text-gray-500">
              🕒{' '}
              {event.event_time
                ? new Date(event.event_time).toLocaleString()
                : 'No time set'}
            </p>

            <p className="text-gray-700">{event.description}</p>

            <p className="text-sm text-gray-500">
              Organised by:{' '}
              {event.creator_id
                ? 'User'
                : event.council_username || 'Council'}
            </p>
          </div>

          {creator && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Organiser</h2>

              <div className="flex items-center gap-4">
                <img
                  src={creator.avatar_url}
                  className="w-16 h-16 rounded-full border"
                />
                <div>
                  <p className="font-semibold text-gray-700">{creator.username}</p>
                  <p className="text-sm text-gray-500">{creator.bio}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
            <p className="text-blue-600 font-medium">
              {rsvps.length} RSVP{rsvps.length !== 1 ? 's' : ''}
            </p>

            <div className="flex gap-3">
              <button
                onClick={toggleRsvp}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white"
              >
                {isGoing ? 'Cancel RSVP' : 'RSVP'}
              </button>

              {userId === event.creator_id && (
                <button
                  onClick={deleteEvent}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {event.latitude && event.longitude && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Location</h2>

              <div className="h-[400px] border rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    event.longitude - 0.01
                  },${event.latitude - 0.01},${
                    event.longitude + 0.01
                  },${event.latitude + 0.01}&layer=mapnik&marker=${
                    event.latitude
                  },${event.longitude}`}
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendees</h2>

            {attendees.length === 0 ? (
              <p className="text-gray-500">No attendees yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {attendees.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full"
                  >
                    <img
                      src={a.avatar_url}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{a.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Community Posts</h2>

            <textarea
              className="w-full border p-3 rounded-lg"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share something..."
            />

            <button
              onClick={createPost}
              disabled={posting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {posting ? 'Posting...' : 'Post'}
            </button>

            <div className="space-y-4">
              {posts.map((p) => (
                <div key={p.id} className="border p-4 rounded-lg">
                  <p className="font-semibold">
                    {p.profile?.username || 'User'}
                  </p>
                  <p className="text-gray-700">{p.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}