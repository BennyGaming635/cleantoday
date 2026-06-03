import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const { userID } = await req.json();

    if (!userID) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const cutoff = new Date('2026-08-01T00:00:00Z')

    if (new Date() < cutoff) {
        const { error } = await supabase.from('user_achievements').upsert({
            user_id: userID,
            achievement_key: 'beta_tester',
            earned_at: new Date().toISOString(),
            desc: 'Joined during the beta phase',
        })

        if (error) {
            return NextResponse.json({ error: 'Failed to award achievement' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Achievement awarded successfully' });
}