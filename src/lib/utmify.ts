import { supabaseAdmin } from '@/lib/supabase';
import { TICKET_PRICE } from '@/config/pricing';
import { getCampaignSettings } from '@/lib/campaign';

export type UtmifySettings = {
  enabled: boolean;
  sendPending: boolean;
  sendPaid: boolean;
  apiUrl: string;
  token: string;
  platform: string; // ex.: 'rifa-system'
};

export const DEFAULT_UTMIFY: UtmifySettings = {
  enabled: false,
  sendPending: true,
  sendPaid: true,
  apiUrl: 'https://api.utmify.com.br/api-credentials/orders',
  token: '',
  platform: 'rifa-system',
};

export async function getUtmifySettings(): Promise<UtmifySettings> {
  try {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('id', 'utmify')
      .single();
    const value = (data?.value ?? {}) as Partial<UtmifySettings>;
    return { ...DEFAULT_UTMIFY, ...value };
  } catch {
    return DEFAULT_UTMIFY;
  }
}

type CommonPayload = {
  orderId: string;
  status: 'waiting_payment' | 'paid';
  createdAt: string; // UTC string 'YYYY-MM-DD HH:mm:ss'
  approvedDate?: string | null;
  ip?: string | null;
  customer: { name: string; email: string; document: string };
  quantity: number;
  totalValue: number; // BRL
};

function toUtcSqlDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export async function postUtmifyOrder(common: CommonPayload) {
  const settings = await getUtmifySettings();
  if (!settings.enabled || !settings.token || !settings.apiUrl) {
    console.log('[UTMIFY] Skip: disabled or missing token/apiUrl');
    return;
  }
  const campaign = await getCampaignSettings();
  const priceInCents = Math.round(TICKET_PRICE * 100);
  const totalInCents = Math.round(common.totalValue * 100);
  const payload = {
    orderId: common.orderId,
    platform: settings.platform || 'rifa-system',
    paymentMethod: 'pix',
    status: common.status,
    createdAt: common.createdAt,
    approvedDate: common.approvedDate ?? null,
    refundedAt: null,
    customer: {
      name: common.customer.name,
      email: common.customer.email,
      phone: null,
      document: common.customer.document,
      country: 'BR',
      ip: common.ip ?? null,
    },
    products: [
      {
        id: 'CAMPAIGN',
        name: campaign.title,
        planId: null,
        planName: null,
        quantity: common.quantity,
        priceInCents: priceInCents,
      },
    ],
    trackingParameters: {},
    commission: {
      totalPriceInCents: totalInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: totalInCents,
    },
    isTest: false,
  };

  try {
    const res = await fetch(settings.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': settings.token,
      },
      body: JSON.stringify(payload),
    });
    const txt = await res.text();
    console.log('[UTMIFY] POST', settings.apiUrl, res.status, txt);
  } catch (e) {
    console.error('[UTMIFY] error', e);
  }
}

export { toUtcSqlDate };


