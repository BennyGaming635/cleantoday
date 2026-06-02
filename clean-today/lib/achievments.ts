import { supabase } from '@/lib/supabase'

export async function awardAchievement(
  userId: string,
  achievementKey: string
) {
  await supabase.from('user_achievements').upsert(
    {
      user_id: userId,
      achievement_key: achievementKey,
      desc: 'This user was a member who was here from the start!',
      earned_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,achievement_key',
    }
  )
}