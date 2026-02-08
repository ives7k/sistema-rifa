import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { processPaymentConfirmation } from '@/services/payments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

// Rota para CRON: reconcilia compras pendentes chamando a SkalePay
export async function POST() {
  try {
    const { data: pendentes, error } = await supabaseAdmin
      .from('compras')
      .select('transaction_id')
      .eq('status', 'pending')
      .limit(100);

    if (error) throw error;

    const results = [] as Array<{ id: string; status: string; updated: boolean }>;
    for (const c of pendentes || []) {
      try {
        const r = await processPaymentConfirmation(c.transaction_id);
        results.push({ id: c.transaction_id, status: r.status, updated: r.updated });
      } catch (e) {
        console.error('Erro ao reconciliar', c.transaction_id, e);
      }
    }

    return NextResponse.json({ success: true, processed: results.length, results });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro interno';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}


