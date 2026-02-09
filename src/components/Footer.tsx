// src/components/Footer.tsx
"use client";

import Image from 'next/image';

const Footer = () => {
  return (
    <footer
      className="mt-10 py-8 px-4 text-white"
      style={{
        fontFamily: 'Ubuntu, sans-serif',
        backgroundColor: '#212121'
      }}
    >
      <div className="container mx-auto max-w-lg">
        {/* Logo */}
        <div className="mb-4 text-center">
          <h2 className="text-3xl font-bold italic tracking-tight">
            PIX DO<br />MILHÃO
          </h2>
        </div>

        {/* Redes Sociais */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
            <i className="bi bi-instagram text-xl"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
            <i className="bi bi-facebook text-xl"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-80 transition-opacity">
            <i className="bi bi-youtube text-xl"></i>
          </a>
        </div>

        {/* Texto Legal */}
        <div className="mb-8 text-xs text-gray-300 leading-relaxed text-center">
          <p>
            Sorteios lastreados por Títulos de Capitalização, da Modalidade Incentivo,
            emitidos pela VIA Capitalização SA, inscritos no CNPJ sob nº 88.076.302/0001-94,
            e aprovados pela SUSEP através do registro na SUSEP Sorteio nº 115414.675594/2025-89
            e 15414.675595/2025-23. O valor das premiações aqui indicadas são líquidos,
            já descontado o devido imposto de renda de 25%. O registro deste plano na SUSEP não
            implica, por parte da Autarquia, incentivo ou recomendação a suas negociações.
          </p>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-600 mb-6"></div>

        {/* Parceiros */}
        <div className="flex justify-center items-start gap-12 mb-6">
          <div className="text-center">
            <span className="text-xs text-gray-400 block mb-2">Títulos emitidos por:</span>
            <Image
              src="https://assets.pixdomilhao.com.br/pix-do-milhao/image/1002772142.png?fm=webp&cs=origin&auto=compress&h=71"
              alt="ViaCap"
              width={80}
              height={35}
              className="h-8 w-auto mx-auto"
              unoptimized
            />
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-400 block mb-2">Desenvolvimento:</span>
            <Image
              src="https://pixdomilhao.com.br/assets/logo-even-BUretYU3.png?fm=webp&cs=origin&auto=compress&h=71"
              alt="Even Tecnologia"
              width={100}
              height={35}
              className="h-8 w-auto mx-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
              unoptimized
            />
          </div>
        </div>

        {/* Google Safe Browsing */}
        <div className="mb-8 flex justify-center">
          <Image
            src="https://pixdomilhao.com.br/assets/seal-google-safe-browsing-BOx6Vl9C.png?fm=webp&cs=origin&auto=compress&w=275&h=82"
            alt="Google Safe Browsing"
            width={140}
            height={42}
            className="h-10 w-auto"
            unoptimized
          />
        </div>

        {/* Links - Alinhados à esquerda */}
        <div className="text-xs text-left space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="/institucional/termos-de-uso" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a>
            <a href="/institucional/politica-de-privacidade" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a>
            <a href="/institucional/perguntas-frequentes" className="text-gray-300 hover:text-white transition-colors">Perguntas frequentes</a>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="/institucional/jogo-responsavel" className="text-gray-300 hover:text-white transition-colors">Jogo Responsável</a>
            <a href="/contato" className="text-gray-300 hover:text-white transition-colors">Contato</a>
            <span className="text-gray-300">Sac ViaCap - (51) 3303-3851</span>
          </div>
          <div className="pt-2">
            <p className="text-gray-400">Ouvidoria ViaCap - 0800 874 1505</p>
            <p className="text-gray-400">PIX DO MILHÃO — 30.682.309/0001-70</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
