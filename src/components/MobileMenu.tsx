// src/components/MobileMenu.tsx
"use client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <div 
        className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gray-800 text-white p-6 z-50 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={onClose} className="text-white">
            <i className="bi bi-x-lg text-2xl"></i>
          </button>
        </div>
        <nav>
          <ul className="space-y-4">
            <li><a href="/" className="hover:text-yellow-400">Início</a></li>
            <li><a href="/campanhas" className="hover:text-yellow-400">Campanhas</a></li>
            <li><a href="/meus-numeros" className="hover:text-yellow-400">Meus títulos</a></li>
            <li><a href="/ganhadores" className="hover:text-yellow-400">Ganhadores</a></li>
            <li><a href="/contato" className="hover:text-yellow-400">Suporte</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
