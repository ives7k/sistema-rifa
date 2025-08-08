import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('id', 'facebook')
      .single();
    return NextResponse.json({ success: true, settings: (data as any)?.value || {} });
  } catch (e) {
    return NextResponse.json({ success: true, settings: {} });
  }
}


