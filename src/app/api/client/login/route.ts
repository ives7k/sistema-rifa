import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { limparCpf } from '@/utils/formatters';
import { buildLoginCookie } from '@/lib/clientAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawCpf = (body?.cpf ?? '').toString();
    const cpf = limparCpf(rawCpf);
    if (!cpf) return NextResponse.json({ success: false, message: 'cpf_required' }, { status: 400 });

    const { data: cliente, error } = await supabaseAdmin
      .from('clientes')
      .select('id, nome, email, cpf')
      .eq('cpf', cpf)
      .single();
    if (error || !cliente) return NextResponse.json({ success: false, message: 'cliente_not_found' }, { status: 404 });

    const res = NextResponse.json({ success: true, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } });
    res.headers.append('Set-Cookie', buildLoginCookie(String(cliente.id)));
    return res;
  } catch (e) {
    return NextResponse.json({ success: false, message: 'error' }, { status: 500 });
  }
}


