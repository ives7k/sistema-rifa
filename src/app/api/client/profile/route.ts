import { NextResponse } from 'next/server';
import { getClientIdFromRequest } from '@/lib/clientAuth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const cid = await getClientIdFromRequest(request);
    if (!cid) return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 });
    const { data: cliente, error } = await supabaseAdmin
      .from('clientes')
      .select('id, nome, email, cpf, telefone')
      .eq('id', cid)
      .single();
    if (error || !cliente) return NextResponse.json({ success: false, message: 'not_found' }, { status: 404 });
    return NextResponse.json({ success: true, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, cpf: cliente.cpf, telefone: cliente.telefone } });
  } catch {
    return NextResponse.json({ success: false, message: 'error' }, { status: 500 });
  }
}


