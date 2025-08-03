// src/components/Campaign.tsx

const Campaign = () => {
  return (
    <section className="text-white text-left">
      
      {/* Container para o texto da campanha */}
      <div className="space-y-1">
        
        {/* Linha com "Adquira já!" e o número */}
        <div className="flex items-center space-x-2">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md animate-pulse">Adquira já!</span>
          <span className="text-xs font-semibold bg-black/40 px-2 py-1 rounded-md">15414.643737/2025-93</span>
        </div>
        
        {/* Título */}
        <div>
            <h1 className="text-xl font-bold tracking-tight">EDIÇÃO 76 - NOVO TERA 2026 0KM</h1>
        </div>
      </div>
      
    </section>
  );
};

export default Campaign;
