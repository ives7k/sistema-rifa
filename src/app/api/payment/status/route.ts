// src/app/api/payment/status/route.ts
import { NextResponse } from 'next/server';
import { processPaymentConfirmation } from '@/services/payments';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id: transactionId } = body;

        if (!transactionId) {
            return NextResponse.json({ success: false, message: 'ID da transação não fornecido.' }, { status: 400 });
        }
        const result = await processPaymentConfirmation(transactionId);
        return NextResponse.json({ success: true, status: result.status, data: result.raw, titles: result.titles });

    } catch (error) {
        console.error('Erro interno ao verificar status do pagamento:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor.';
        return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
    }
}