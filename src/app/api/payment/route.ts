import { NextResponse } from 'next/server';

// Função para limpar telefone (remover formatação)
function limparTelefone(telefone: string | null): string {
    if (!telefone) return "11999999999";

    // Remove tudo que não é número
    let telefone_limpo = telefone.replace(/[^0-9]/g, '');

    // Se começar com 0, remove o 0
    if (telefone_limpo.startsWith('0')) {
        telefone_limpo = telefone_limpo.substring(1);
    }

    // Se não tiver DDD, adiciona 11 (ex: 8 dígitos)
    if (telefone_limpo.length === 8) {
        telefone_limpo = '11' + telefone_limpo;
    }

    // Se tiver 9 dígitos, adiciona DDD 11
    if (telefone_limpo.length === 9) {
        telefone_limpo = '11' + telefone_limpo;
    }

    // Garante que tenha pelo menos 10 dígitos
    if (telefone_limpo.length < 10) {
        return "11999999999";
    }

    return telefone_limpo;
}

// Função para gerar CPF válido
function gerarCPF(): string {
    let cpf = '';
    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = (resto < 2) ? 0 : 11 - resto;
    cpf += digito1;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = (resto < 2) ? 0 : 11 - resto;
    cpf += digito2;

    const invalidos = [
        '00000000000', '11111111111', '22222222222', '33333333333',
        '44444444444', '55555555555', '66666666666', '77777777777',
        '88888888888', '99999999999'
    ];

    if (invalidos.includes(cpf)) {
        return gerarCPF();
    }

    return cpf;
}

function gerarNomeAleatorio(): string {
    const nomes_masculinos = [
        'João', 'Pedro', 'Lucas', 'Miguel', 'Arthur', 'Gabriel', 'Bernardo', 'Rafael',
        'Gustavo', 'Felipe', 'Daniel', 'Matheus', 'Bruno', 'Thiago', 'Carlos'
    ];
    const nomes_femininos = [
        'Maria', 'Ana', 'Julia', 'Sofia', 'Isabella', 'Helena', 'Valentina', 'Laura',
        'Alice', 'Manuela', 'Beatriz', 'Clara', 'Luiza', 'Mariana', 'Sophia'
    ];
    const sobrenomes = [
        'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
        'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
        'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'
    ];

    const genero = Math.round(Math.random());
    const nome = genero ?
        nomes_masculinos[Math.floor(Math.random() * nomes_masculinos.length)] :
        nomes_femininos[Math.floor(Math.random() * nomes_femininos.length)];

    const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];

    return `${nome} ${sobrenome1} ${sobrenome2}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { valor, nome, telefone } = body;

        if (!valor || valor <= 0) {
            throw new Error('Valor inválido');
        }

        const valor_centavos = Math.round(valor * 100);

        const nome_cliente = nome || gerarNomeAleatorio();
        const email = `${nome_cliente.toLowerCase().replace(/\s/g, '.')}@email.com`;
        const cpf = gerarCPF();
        const telefone_cliente = limparTelefone(telefone);

        const apiUrl = 'https://api.conta.skalepay.com.br/v1';
        const secretKey = process.env.SKALEPLAY_SECRET_KEY;

        if (!secretKey) {
            throw new Error('Chave secreta da API não configurada.');
        }

        const authString = `${secretKey}:x`;
        const authHeader = `Basic ${Buffer.from(authString).toString('base64')}`;

        const data = {
            "amount": valor_centavos,
            "paymentMethod": "pix",
            "customer": {
                "name": nome_cliente,
                "email": email,
                "document": {
                    "type": "cpf",
                    "number": cpf
                },
                "phone": telefone_cliente,
                "ip": request.headers.get('x-forwarded-for') ?? '127.0.0.1'
            },
            "items": [
                {
                    "id": `PROD_${new Date().getTime()}`,
                    "title": "Produto Padrao",
                    "quantity": 1,
                    "unitPrice": valor_centavos,
                    "tangible": false
                }
            ],
            "pix": {
                "expiresIn": 3600 // 1 hora de expiração
            },
            "traceable": true,
            "postbackUrl": `https://${request.headers.get('host')}/webhook/paguesafe`
        };

        const response = await fetch(`${apiUrl}/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro na API: HTTP ${response.status} - ${errorBody}`);
        }

        const result = await response.json();

        if (!result.id || !result.pix?.qrcode) {
            throw new Error("Resposta da API inválida ou incompleta.");
        }
        
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(result.pix.qrcode)}&size=300x300`;


        return NextResponse.json({
            success: true,
            token: result.id,
            pixCopiaECola: result.pix.qrcode,
            qrCodeUrl: qrCodeUrl,
            valor: valor,
        });

    } catch (error) {
        console.error("Erro ao processar pagamento:", error);
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

