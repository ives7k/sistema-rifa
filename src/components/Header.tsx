// src/components/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link'; // Importa o Link
import MobileMenu from './MobileMenu';
import { Bungee } from 'next/font/google';

const bungee = Bungee({ subsets: ['latin'], weight: '400' });

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black shadow-lg py-2">
        <div className="container mx-auto max-w-lg px-4">
          <div className="flex justify-between items-center">

            {/* Ícone do Menu */}
            <div className="flex-1 flex justify-start">
              <button className="text-white" onClick={() => setIsMenuOpen(true)}>
                <i className="bi bi-list text-4xl"></i>
              </button>
            </div>

            {/* Logo Centralizado */}
            <div className="flex-shrink-0">
              <Link href="/" passHref>
                <div className="w-[160px] cursor-pointer">
                  <span
                    aria-label="Rifas7k"
                    className={`${bungee.className} block text-center bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent text-2xl leading-none select-none`}
                  >
                    Rifas7k
                  </span>
                </div>
              </Link>
            </div>

            {/* Espaço vazio para manter o logo centralizado */}
            <div className="flex-1 flex justify-end"></div>
            
          </div>
        </div>
      </header>

      {/* Componente do Menu Lateral */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
