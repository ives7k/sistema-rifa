import { supabaseAdmin } from '@/lib/supabase';

export type FacebookSettings = {
  enabled: boolean;
  sendPurchase: boolean;
  pixelId: string;
  capiToken: string;
};

export const DEFAULT_FB: FacebookSettings = {
  enabled: false,
  sendPurchase: false,
  pixelId: '',
  capiToken: '',
};

export async function getFacebookSettings(): Promise<FacebookSettings> {
  try {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('id', 'facebook')
      .single();
    const value = (data as { value?: Partial<FacebookSettings> } | null)?.value || {};
    return { ...DEFAULT_FB, ...value };
  } catch {
    return DEFAULT_FB;
  }
}


