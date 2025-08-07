import { NextResponse } from 'next/server';

const SKALEPAY_API_URL = 'https://api.conta.skalepay.com.br/v1';

/**
 * Endpoint para verificar o status de uma transação na SkalePay.
 * Recebe o ID da transação via query param.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return new NextResponse(JSON.stringify({ success: false, message: 'ID da transação não fornecido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secretKey = process.env.SKALEPLAY_SECRET_KEY;
    if (!secretKey) {
      throw new Error('Chave secreta da API não configurada.');
    }

    const authString = `${secretKey}:x`;
    const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`;

    const response = await fetch(`${SKALEPAY_API_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao consultar a API da SkalePay: HTTP ${response.status} - ${errorBody}`);
    }

    const result = await response.json();

    // Retornamos o status da transação para o frontend
    return NextResponse.json({
      success: true,
      status: result.status, // Ex: 'paid', 'pending', 'expired'
      data: result,
    });

  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    let errorMessage = "Ocorreu um erro desconhecido.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ success: false, message: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
}

