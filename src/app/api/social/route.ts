import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const supabase = await createClient();
  
  // Get all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url');

  if (profilesError || !profiles) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }

  // Get checkins for the date
  const { data: checkins, error: checkinsError } = await supabase
    .from('checkins')
    .select('user_id, prayed_rosary, intention')
    .eq('date', date);

  if (checkinsError) {
    return NextResponse.json({ error: 'Failed to fetch checkins' }, { status: 500 });
  }

  // Merge data
  const socialData = profiles.map(profile => {
    const checkin = checkins?.find(c => c.user_id === profile.id);
    return {
      id: profile.id,
      name: profile.full_name || 'Usuario',
      avatar: profile.avatar_url,
      prayed_rosary: checkin?.prayed_rosary || false,
      intention: checkin?.intention || ''
    };
  });

  // Sort: Completed first, then by name
  socialData.sort((a, b) => {
    if (a.prayed_rosary === b.prayed_rosary) {
      return a.name.localeCompare(b.name);
    }
    return a.prayed_rosary ? -1 : 1;
  });

  return NextResponse.json(socialData);
}
