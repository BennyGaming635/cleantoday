export type CleanupEvent = {
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
  attendees_count: number
}