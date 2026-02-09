// src/components/BannersSection.tsx
"use client";

import Image from 'next/image';

interface Banner {
    id: string;
    imageUrl: string;
    link: string;
    alt: string;
}

const banners: Banner[] = [
    {
        id: '1',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/2844327349.png?auto=compress&cs=origin&fm=webp',
        link: 'https://onelink.to/ycmkev',
        alt: 'Baixe agora o nosso aplicativo'
    },
    {
        id: '2',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/2905272123.png?auto=compress&cs=origin&fm=webp',
        link: 'https://sndflw.com/i/comunidade-trafego',
        alt: 'Comunidade de Tráfego'
    },
    {
        id: '3',
        imageUrl: 'https://assets.pixdomilhao.com.br/pix-do-milhao/image/501573596.png?auto=compress&cs=origin&fm=webp',
        link: '#',
        alt: 'Banner promocional'
    }
];

const BannersSection = () => {
    return (
        <section
            className="container mx-auto max-w-lg px-3 my-5"
            style={{ fontFamily: 'Ubuntu, sans-serif' }}
        >
            {/* Scroll horizontal de banners */}
            <div className="overflow-x-auto scrollbar-none -mx-3">
                <div className="flex gap-2 px-3 pb-2">
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="w-52 min-w-[208px] shrink-0 block rounded-lg overflow-hidden shadow-md cursor-default"
                        >
                            <Image
                                src={banner.imageUrl}
                                alt={banner.alt}
                                width={208}
                                height={117}
                                className="w-full h-auto rounded-lg"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BannersSection;
