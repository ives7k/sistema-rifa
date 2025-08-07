import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Endpoint para receber notificações de postback da SkalePay.
 * A SkalePay enviará uma requisição POST para esta URL sempre que 
 * o status de uma transação for alterado.
 */
export async function POST(request: Request) {
  // Log para confirmar que a função foi invocada
  console.log('Endpoint /webhook/paguesafe foi chamado.');

  try {
    // Log dos cabeçalhos para depuração
    const headersList = headers();
    console.log('Headers recebidos:', JSON.stringify(Object.fromEntries(headersList.entries()), null, 2));

    // Lê o corpo como texto para evitar erros de parse
    const bodyAsText = await request.text();
    console.log('Corpo (raw) recebido:', bodyAsText);

    // Se o corpo estiver vazio, não há o que processar.
    if (!bodyAsText) {
        console.log('Webhook recebido com corpo vazio.');
        return NextResponse.json({ success: true, message: 'Webhook com corpo vazio recebido.' });
    }

    let payload;
    try {
        // Tenta fazer o parse do corpo como JSON
        payload = JSON.parse(bodyAsText);
    } catch (parseError) {
        console.error('Erro ao fazer o parse do JSON do webhook:', parseError);
        // Responde com erro, mas a SkalePay não deve tentar novamente.
        return new NextResponse(JSON.stringify({ success: false, message: 'Erro de parse do JSON.' }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    console.log('--- Webhook da SkalePay Recebido e Processado ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('-------------------------------------------------');
    
    // Futuramente, aqui você processaria o payload para atualizar o banco de dados.
    // Ex: const { id, status } = payload; if (status === 'paid') { ... }
    
    // Responde à SkalePay com sucesso para confirmar o recebimento.
    return NextResponse.json({ success: true, message: 'Webhook recebido com sucesso.' });

  } catch (error) {
    console.error('Erro inesperado ao processar webhook da SkalePay:', error);
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new NextResponse(JSON.stringify({ success: false, message: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
}
