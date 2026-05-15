'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/navbar/Navbar'
import { supabase } from '@/lib/supabase'

type Event = {
  id: string
  title: string
  description: string
  location_name: string
  latitude: number
  longitude: number
  creator_id: string
  event_time: string | null
  completed: boolean
  kg_collected: number
}

type Profile = {
  id: string
  username: string
  avatar_url: string
  bio: string
}

type RSVP = {
  user_id: string
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

    const { data: creatorData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', eventData.creator_id)
      .single()

    setCreator(creatorData)

    const { data: rsvpData } = await supabase
      .from('event_rsvps')
      .select('user_id')
      .eq('event_id', eventId)

    const attendeeIds =
      rsvpData?.map((r: RSVP) => r.user_id) || []

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

    if (postsData && postsData.length > 0) {
      const postUserIds = postsData.map(
        (p) => p.user_id
      )

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', postUserIds)

      const mergedPosts = postsData.map((post) => ({
        ...post,
        profile: profileData?.find(
          (p) => p.id === post.user_id
        ),
      }))

      setPosts(mergedPosts)
    }

    setLoading(false)
  }

  useEffect(() => {
    const run = async () => {
      await load()
    }

    void run()
  }, [])

  const isGoing = userId
    ? rsvps.includes(userId)
    : false

  const toggleRsvp = async () => {
    if (!event) {
      return
    }

    if (event.completed) {
      alert('This event has already been completed and can no longer be RSVPed to.')
      return
    }
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

      setRsvps((prev) =>
        prev.filter((u) => u !== userId)
      )

      setAttendees((prev) =>
        prev.filter((a) => a.id !== userId)
      )
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

    const confirmed = confirm(
      'Delete this event?'
    )

    if (!confirmed) return

    await supabase
      .from('cleanup_events')
      .delete()
      .eq('id', event.id)

    router.push('/explore')
  }

  const createPost = async () => {
    if (!userId || !event) {
      router.push('/login')
      return
    }

    if (!postContent.trim() && !imageFile) {
      alert('Write something or upload an image')
      return
    }

    setPosting(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const fileExt =
          imageFile.name.split('.').pop()

        const fileName = `${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } =
          await supabase.storage
            .from('event-images')
            .upload(fileName, imageFile)

        if (uploadError) {
          console.error(uploadError)
          alert(uploadError.message)
          setPosting(false)
          return
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from('event-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      const { error: insertError } =
        await supabase
          .from('event_posts')
          .insert({
            event_id: event.id,
            user_id: userId,
            content: postContent,
            image_url: imageUrl,
          })

      if (insertError) {
        console.error(insertError)
        alert(insertError.message)
        setPosting(false)
        return
      }

      const { data: postsData } = await supabase
        .from('event_posts')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', {
          ascending: false,
        })

      const userIds =
        postsData?.map((p) => p.user_id) || []

      const { data: profileData } =
        await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds)

      const mergedPosts =
        postsData?.map((post) => ({
          ...post,
          profile: profileData?.find(
            (p) => p.id === post.user_id
          ),
        })) || []

      setPosts(mergedPosts)

      setPostContent('')
      setImageFile(null)
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }

    setPosting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-6">
          Loading...
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="p-6">
          Event not found.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="bg-white rounded-xl shadow p-8 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-green-700">
                {event.title}
              </h1>

              <p className="text-gray-500 mt-2">
                📍 {event.location_name}
              </p>
              <p className="text-gray-500 mt-2">
                🕒 {event.event_time
                  ? new Date(event.event_time).toLocaleString()
                  : 'No time set'}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Organiser
            </h2>

            {creator && (
              <div className="flex items-center gap-4 text-gray-700">
                <img
                  src={creator.avatar_url}
                  alt={creator.username}
                  className="w-16 h-16 rounded-full border object-cover"
                />

                <div>
                  <h3 className="font-semibold text-lg">
                    {creator.username}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {creator.bio || 'No bio yet'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-blue-600 font-medium">
              {rsvps.length} RSVP
              {rsvps.length !== 1 ? 's' : ''}
            </p>

            <div className="flex gap-3">
              <button
                onClick={toggleRsvp}
                disabled={event.completed}
                className={`px-5 py-2 rounded-lg text-white transition ${
                  event.completed
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isGoing
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {event.completed
                  ? 'Event Completed'
                  : isGoing
                  ? 'Cancel RSVP'
                  : 'RSVP'}
              </button>

              {userId === event.creator_id && (
                <button
                  onClick={deleteEvent}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Location
            </h2>

            <div className="w-full h-[400px] rounded-xl overflow-hidden border">
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

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Attendees
            </h2>

            {attendees.length === 0 ? (
              <p className="text-gray-500">
                No attendees yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center gap-3 bg-gray-50 border rounded-full pl-2 pr-4 py-2"
                  >
                    <img
                      src={attendee.avatar_url}
                      alt={attendee.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {attendee.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 space-y-6">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Community Posts
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Share updates and cleanup photos
              </p>
            </div>

            <div className="space-y-4 border rounded-xl p-4 bg-gray-50">

              <textarea
                value={postContent}
                onChange={(e) =>
                  setPostContent(e.target.value)
                }
                placeholder="Share something..."
                className="w-full border rounded-lg p-3 min-h-[120px] text-gray-700"
              />

              <button
                onClick={createPost}
                disabled={posting}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                {posting
                  ? 'Posting...'
                  : 'Post'}
              </button>
            </div>

            <div className="space-y-6">
              {posts.length === 0 ? (
                <p className="text-gray-500">
                  No posts yet.
                </p>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-xl p-5 space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post.profile
                            ?.avatar_url ||
                          '/default-avatar.png'
                        }
                        alt={
                          post.profile
                            ?.username || 'User'
                        }
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>
                        <p className="font-medium text-gray-800">
                          {post.profile
                            ?.username || 'User'}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Date(
                            post.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {post.content && (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    )}

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="rounded-xl border max-h-[500px] w-full object-cover"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}