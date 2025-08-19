'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WinwheelRoulette from '@/components/WinwheelRoulette';
import Script from 'next/script';
import { Bungee } from 'next/font/google';

const bungee = Bungee({ subsets: ['latin'], weight: '400' });

import { useCallback, useEffect, useState } from 'react';
import { limparCpf } from '@/utils/formatters';

export default function RoletaPage() {
  const [cpf, setCpf] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBalance = useCallback(async (cpfInput: string) => {
    const clean = limparCpf(cpfInput);
    if (!clean) { setBalance(0); return; }
    setLoading(true);
    try {
      const resp = await fetch('/api/roulette/balance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cpf: clean }) });
      if (!resp.ok) { setBalance(0); return; }
      const data = await resp.json();
      setBalance(Number(data?.balance ?? 0));
    } catch { setBalance(0); } finally { setLoading(false); }
  }, []);

  const handleSpinStart = () => true;
  const handleFinished = () => { if (cpf) fetchBalance(cpf); };

  // Ao montar, tenta puxar saldo pela sessão (sem CPF). Se houver, não precisa digitar.
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch('/api/roulette/balance', { method: 'POST' });
        if (resp.ok) {
          const data = await resp.json();
          setBalance(Number(data?.balance ?? 0));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="bg-[#ebebeb] min-h-screen">
      {/* GSAP TweenMax v2 (necessária para Winwheel.js clássico) */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js" strategy="afterInteractive" />
      {/* Winwheel.js via CDN - expõe window.Winwheel */}
      <Script src="https://cdn.jsdelivr.net/gh/zarocknz/javascript-winwheel/Winwheel.min.js" strategy="afterInteractive" />

      <Header />

      <div className="container mx-auto max-w-lg px-4 mt-2 space-y-2">
        <div className="bg-white p-2 rounded-lg shadow-md">
          <div className="text-center mt-6 sm:mt-8 mb-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide drop-shadow-sm" style={{ letterSpacing: '0.02em' }}>
              <span className={`${bungee.className} bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent`}>
                Roleta da Sorte
              </span>
            </h1>
            <p className="mt-1 text-base sm:text-lg text-gray-700 font-semibold">Gire a roleta e boa sorte!</p>
            <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2 justify-between">
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="Informe seu CPF para usar os giros"
                  className="flex-1 border rounded-md px-3 py-2 text-sm"
                />
                <button
                  onClick={() => fetchBalance(cpf)}
                  className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Atualizar saldo'}
                </button>
              </div>
              <div className="bg-gray-100 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 text-right">
                Giros restantes: <span className="text-gray-900">{balance}</span>
              </div>
            </div>
          </div>

          <div className="mx-auto" style={{ width: 340, overflow: 'hidden' }}>
            <WinwheelRoulette
              imageSrc="/roleta.png"
              wheelSizePx={340}
              angleOffsetDeg={-30}
              paddingPx={0}
              imageFitScale={1.12}
              playerCpf={cpf}
              onSpinStart={handleSpinStart}
              onFinished={handleFinished}
              disabled={!cpf || balance <= 0}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


