import { NextResponse } from 'next/server';

/**
 * Endpoint para receber notificações de postback da SkalePay.
 * A SkalePay enviará uma requisição POST para esta URL sempre que 
 * o status de uma transação for alterado.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Por enquanto, apenas registramos o payload recebido no console.
    // Em uma implementação futura, aqui é onde você atualizaria
    // o status do pedido em seu banco de dados.
    console.log('--- Webhook da SkalePay Recebido ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('------------------------------------');
    
    // É crucial responder à SkalePay com um status 200 OK para confirmar o recebimento.
    // Se não respondermos corretamente, a SkalePay pode tentar reenviar a notificação.
    return NextResponse.json({ success: true, message: 'Webhook recebido com sucesso.' });

  } catch (error) {
    console.error('Erro ao processar webhook da SkalePay:', error);
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Retorna uma resposta de erro, mas ainda com um status que o servidor conseguiu tratar.
    return new NextResponse(JSON.stringify({ success: false, message: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
}

