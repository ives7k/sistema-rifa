// src/components/CheckoutModal.tsx
"use client";

import { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
}

interface PixData {
    qrCodeUrl: string;
    pixCopiaECola: string;
}

const TICKET_PRICE = 0.11;

const CheckoutModal = ({ isOpen, onClose, quantity }: CheckoutModalProps) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);

  if (!isOpen) {
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPixData(null);

    try {
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                valor: quantity * TICKET_PRICE,
                telefone: phone,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Erro ao processar o pagamento.');
        }
        
        setPixData({
            qrCodeUrl: data.qrCodeUrl,
            pixCopiaECola: data.pixCopiaECola,
        });

    } catch (err: any) {
        setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (pixData?.pixCopiaECola) {
        navigator.clipboard.writeText(pixData.pixCopiaECola);
        alert('Código PIX copiado para a área de transferência!');
    }
  }

  return (
    // Fundo semi-transparente
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="relative text-center p-3 border-b border-gray-200">
          <h5 className="text-lg font-semibold text-gray-700">Checkout</h5>
          <button onClick={onClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <i className="bi bi-x text-2xl"></i>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-500">
                <b className="text-gray-700">{quantity}</b> unidade(s) do produto <b className="text-gray-700">EDIÇÃO 76 - NOVO TERA 2026 0KM</b>
            </div>
            
            {pixData ? (
                <div className="text-center space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Pague com PIX para finalizar</h3>
                    <img src={pixData.qrCodeUrl} alt="QR Code PIX" className="mx-auto border-4 border-green-500 rounded-lg"/>
                    <button 
                        onClick={copyToClipboard}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center space-x-2 transition-colors"
                    >
                        <i className="bi bi-clipboard-check-fill"></i>
                        <span>PIX Copia e Cola</span>
                    </button>
                    <p className="text-xs text-gray-500">Obrigado por participar!</p>
                </div>
            ) : (
                <form className="space-y-3" onSubmit={handlePayment}>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-1">
                            Informe seu telefone
                        </label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                            placeholder="(00) 00000-0000"
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                         <div className="bg-red-100 border-l-4 border-red-400 text-red-800 p-3 text-sm rounded-r-md">
                            <i className="bi bi-x-circle-fill mr-2"></i>
                            {error}
                        </div>
                    )}
                    
                    {!phone && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm rounded-r-md">
                            <i className="bi bi-exclamation-circle-fill mr-2"></i>
                            Informe seu telefone para continuar.
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-[#1db954] hover:bg-[#1aa34a] text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center space-x-2 transition-colors disabled:bg-gray-400"
                        disabled={isLoading || !phone}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processando...</span>
                            </>
                        ) : (
                            <>
                                <span>Continuar</span>
                                <i className="bi bi-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
