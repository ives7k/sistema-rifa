import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CampaignSettings = {
  title: string;
  imageUrl: string;
};

const DEFAULT_SETTINGS: CampaignSettings = {
  title: 'EDIÇÃO 76 - NOVO TERA 2026 0KM',
  imageUrl: 'https://s3.incrivelsorteios.com/redimensiona?key=600x600/20250731_688b54af15d40.jpg',
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('id', 'campaign')
      .single();

    if (error || !data) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }

    const value = (data as { value: CampaignSettings | null }).value;
    const settings = {
      ...DEFAULT_SETTINGS,
      ...(value || {}),
    } as CampaignSettings;
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}


