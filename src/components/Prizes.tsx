// src/components/Prizes.tsx
"use client";

import { useState } from 'react';

const allPrizes = [
  // Prêmios já sorteados
  { prize: 'R$ 300,00', winner: 'Washington Luis' },
  { prize: 'R$ 300,00', winner: 'Enio Duarte' },
  { prize: 'R$ 300,00', winner: 'Cristhian dos' },
  { prize: 'R$ 300,00', winner: 'Matheus Lima' },
  { prize: 'R$ 300,00', winner: 'Ewerton hernandes' },
  { prize: 'R$ 300,00', winner: 'Willian Pablo' },
  { prize: 'R$ 300,00', winner: 'Lucas Emanoel' },
  { prize: 'R$ 300,00', winner: 'danilo Bonora' },
  { prize: 'R$ 300,00', winner: 'Douglas dos' },
  { prize: 'R$ 300,00', winner: 'Josenildo Sousa' },
  // Prêmios disponíveis (simulação)
  ...Array(90).fill({ prize: 'R$ 300,00', winner: null }),
];

// Ordena a lista: prêmios com ganhador vão para o final
const sortedPrizes = allPrizes.sort((a, b) => {
  if (a.winner && !b.winner) {
    return 1; // 'a' (com ganhador) vai depois de 'b' (sem ganhador)
  }
  if (!a.winner && b.winner) {
    return -1; // 'a' (sem ganhador) vem antes de 'b' (com ganhador)
  }
  return 0; // mantém a ordem se ambos tiverem ou não ganhador
});


const Prizes = () => {
  const [showAll, setShowAll] = useState(false);
  
  const prizesToShow = showAll ? sortedPrizes : sortedPrizes.slice(0, 10);

  return (
    <section className="bg-white p-2 rounded-lg shadow-md mt-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <i className="bi bi-trophy-fill text-yellow-400 text-2xl mr-2"></i>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Premiações instantâneas</h2>
            <p className="text-xs text-gray-500">Veja a lista de prêmios</p>
          </div>
        </div>
        <div className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          Total 100
        </div>
      </div>
      <div className="flex space-x-2 mb-2">
        <div className="bg-teal-400 text-white text-xs font-semibold p-1 rounded-md flex-1 text-center">
          Disponíveis 90
        </div>
        <div className="bg-pink-500 text-white text-xs font-semibold p-1 rounded-md flex-1 text-center">
          Sorteados 10
        </div>
      </div>
      <div className="space-y-1 text-xs">
        {prizesToShow.map((item, index) => (
          <div key={index} className={`p-2 rounded-md flex justify-between items-center ${item.winner ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>
            <span className="font-semibold">{item.prize}</span>
            {item.winner ? (
              <span className="font-bold flex items-center">{item.winner} <i className="bi bi-trophy-fill text-yellow-400 ml-1"></i></span>
            ) : (
              <span className="font-semibold text-gray-500">Disponível</span>
            )}
          </div>
        ))}
      </div>
      <button 
        onClick={() => setShowAll(!showAll)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-2 text-sm"
      >
        <i className={`bi ${showAll ? 'bi-arrow-up-circle' : 'bi-arrow-down-circle'}`}></i> {showAll ? 'Ver menos' : 'Ver mais'}
      </button>
    </section>
  );
};

export default Prizes;
