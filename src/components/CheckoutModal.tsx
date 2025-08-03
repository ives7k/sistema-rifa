// src/components/CheckoutModal.tsx
"use client";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  totalPrice: number;
}

const CheckoutModal = ({ isOpen, onClose, quantity, totalPrice }: CheckoutModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-bold">Checkout</h5>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-2 rounded-md text-sm">
                <b>{quantity}</b> unidade(s) do produto <b>EDIÇÃO 76 - NOVO TERA 2026 0KM</b>
            </div>
            
            <form className="space-y-3">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Informe seu telefone
                    </label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="(00) 00000-0000"
                    />
                </div>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 text-xs">
                    <i className="bi bi-exclamation-circle mr-2"></i>
                    Informe seu telefone para continuar.
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center space-x-2"
                >
                    <span>Continuar</span>
                    <i className="bi bi-arrow-right"></i>
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
