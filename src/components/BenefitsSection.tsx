// src/components/BenefitsSection.tsx
"use client";

import Image from 'next/image';

interface Benefit {
    id: string;
    title: string;
    imageUrl: string;
    link: string;
}

const benefits: Benefit[] = [
    {
        id: '1',
        title: 'Exclusivos',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/2680986890.png?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/exclusivos'
    },
    {
        id: '2',
        title: 'Loja',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/3897767387.jpg?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/loja'
    },
    {
        id: '3',
        title: 'Gift Cards',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/1180004944.png?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/gift-cards'
    },
    {
        id: '4',
        title: 'Experiências',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/1943312753.jpg?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/experiencias'
    },
    {
        id: '5',
        title: 'Meu Time do Coração',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/1134025943.png?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/meu-time'
    },
    {
        id: '6',
        title: 'Benefícios',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/3452979892.jpg?fm=webp&cs=origin&auto=compress&w=238&h=238',
        link: '/beneficios'
    }
];

const BenefitsSection = () => {
    return (
        <section
            className="container mx-auto max-w-lg px-3 mt-8"
            style={{ fontFamily: 'Ubuntu, sans-serif' }}
        >
            {/* Header com título */}
            <div className="mb-3">
                <h2 className="text-black text-xl font-bold">
                    <span>Conheça nossos benefícios</span>
                </h2>
            </div>

            {/* Scroll horizontal dos benefícios */}
            <div className="overflow-x-auto scrollbar-none -mx-3">
                <div className="flex gap-3 px-3 pb-4">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.id}
                            className="flex flex-col flex-shrink-0 gap-2 p-2 w-[180px] bg-gray-50 rounded-2xl transition duration-300 ease-in-out hover:shadow-lg"
                        >
                            {/* Imagem */}
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                <Image
                                    src={benefit.imageUrl}
                                    alt={benefit.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Título e botão */}
                            <div className="flex flex-col flex-1">
                                <span className="text-base font-normal leading-tight text-center text-gray-800 mb-2">
                                    {benefit.title}
                                </span>
                                <a
                                    href={benefit.link}
                                    className="w-full py-2 px-3 rounded-full text-sm font-medium text-center text-white shadow-lg hover:shadow-xl transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0"
                                    style={{
                                        background: 'linear-gradient(to bottom right, rgb(245, 166, 35), rgb(200, 130, 20))'
                                    }}
                                >
                                    Ver produtos
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
