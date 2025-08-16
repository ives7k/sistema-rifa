export type CampaignSettings = {
  title: string;
  imageUrl: string;
  ticketPrice: number; // preço por título (BRL)
  drawMode: 'fixedDate' | 'sameDay'; // fixedDate usa drawDate; sameDay usa drawDay
  drawDate: string | null; // ISO date (YYYY-MM-DD)
  drawDay: number | null; // 1..31
};

const DEFAULT_SETTINGS: CampaignSettings = {
  title: 'EDIÇÃO 76 - NOVO TERA 2026 0KM',
  imageUrl: 'https://s3.incrivelsorteios.com/redimensiona?key=600x600/20250731_688b54af15d40.jpg',
  ticketPrice: 0.11,
  drawMode: 'fixedDate',
  drawDate: null,
  drawDay: 9,
};

import { supabaseAdmin } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function getCampaignSettings(): Promise<CampaignSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('id', 'campaign')
      .single();

    if (error || !data || !('value' in data)) {
      return DEFAULT_SETTINGS;
    }

    const value = (data as { value: Partial<CampaignSettings> | null }).value;
    return { ...DEFAULT_SETTINGS, ...(value || {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}


