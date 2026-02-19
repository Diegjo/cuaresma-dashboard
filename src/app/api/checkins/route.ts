import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const all = searchParams.get('all');

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabase
    .from('checkins')
    .select('*')
    .eq('user_id', user.id);

  if (date) {
    // Single date checkin
    const { data, error } = await query.eq('date', date).single();
    
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || null);
  } else if (all) {
    // All checkins
    const { data, error } = await query.order('date', { ascending: true });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || []);
  } else {
    return NextResponse.json({ error: 'Date or all param is required' }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, prayedRosary, intention } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      user_id: user.id,
      date,
      updated_at: new Date().toISOString(),
    };

    if (prayedRosary !== undefined) updateData.prayed_rosary = prayedRosary;
    if (intention !== undefined) updateData.intention = intention;

    const { data, error } = await supabase
      .from('checkins')
      .upsert(updateData, { onConflict: 'user_id,date' })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
