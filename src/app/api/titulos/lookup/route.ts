// src/app/api/titulos/lookup/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'edge';

// Hash simples para derivar índice determinístico a partir do CPF
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cpf } = body;

    if (!cpf) {
      return NextResponse.json({ success: false, message: 'CPF não fornecido.' }, { status: 400 });
    }

    // 1. Encontrar o cliente pelo CPF
    const { data: cliente, error: clienteError } = await supabaseAdmin
      .from('clientes')
      .select('id, nome, email, telefone, cpf')
      .eq('cpf', cpf)
      .single();

    if (clienteError || !cliente) {
      if (clienteError && clienteError.code !== 'PGRST116') {
        console.error('Erro ao buscar cliente:', clienteError);
        throw new Error('Erro ao consultar dados do cliente.');
      }
      return NextResponse.json({ success: true, compras: [] });
    }

    // 2. Buscar todas as compras do cliente, ordenadas da mais recente para a mais antiga
    const { data: compras, error: comprasError } = await supabaseAdmin
      .from('compras')
      .select('id, created_at, quantidade_bilhetes, valor_total, status')
      .eq('cliente_id', cliente.id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    if (comprasError) {
      console.error('Erro ao buscar compras:', comprasError);
      throw new Error('Não foi possível buscar o histórico de compras.');
    }

    if (!compras || compras.length === 0) {
      return NextResponse.json({ success: true, compras: [] });
    }

    // 3. Para cada compra, buscar os bilhetes associados
    const comprasComBilhetes = await Promise.all(
      compras.map(async (compra) => {
        if (compra.status !== 'paid') {
          return { ...compra, bilhetes: [] };
        }

        const { data: bilhetes, error: bilhetesError } = await supabaseAdmin
          .from('bilhetes')
          .select('numero')
          .eq('compra_id', compra.id);

        if (bilhetesError) {
          console.error(`Erro ao buscar bilhetes para a compra ${compra.id}:`, bilhetesError);
          return { ...compra, bilhetes: [] };
        }

        // Cada bilhete recebe premiada: false por padrão
        return {
          ...compra,
          bilhetes: (bilhetes || []).map((b: { numero: string }) => ({ ...b, premiada: false }))
        };
      })
    );

    // 4. Marcar UMA cota como premiada (determinístico via hash do CPF)
    const todosBilhetes: { compraIdx: number; bilheteIdx: number }[] = [];
    comprasComBilhetes.forEach((compra, cIdx) => {
      (compra.bilhetes as { numero: string; premiada: boolean }[]).forEach((_b, bIdx) => {
        todosBilhetes.push({ compraIdx: cIdx, bilheteIdx: bIdx });
      });
    });

    if (todosBilhetes.length > 0) {
      const hashVal = simpleHash(cpf);
      const premiadaIdx = hashVal % todosBilhetes.length;
      const { compraIdx, bilheteIdx } = todosBilhetes[premiadaIdx];
      (comprasComBilhetes[compraIdx].bilhetes as { numero: string; premiada: boolean }[])[bilheteIdx].premiada = true;
    }

    return NextResponse.json({
      success: true,
      compras: comprasComBilhetes,
      cliente: {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf,
      }
    });

  } catch (err) {
    console.error("Erro na API de busca de bilhetes:", err);
    let errorMessage = "Ocorreu um erro desconhecido.";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
