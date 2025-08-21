export const MAX_PIX_TOTAL_BR = 200; // Valor máximo por transação PIX (em reais)

export type FreightOption = {
  id: string;
  label: string;
  amount: number; // em reais
  description?: string;
  imageUrl?: string;
  hasInsurance?: boolean;
  subtitle?: string; // ex: "5-9 dias úteis"
};

export const FREIGHT_OPTIONS_BR: FreightOption[] = [
  { id: 'pac', label: 'PAC', subtitle: '5-9 dias úteis', amount: 24.9, imageUrl: '/window.svg' },
  { id: 'sedex', label: 'SEDEX', subtitle: '2-4 dias úteis', amount: 39.9, imageUrl: '/next.svg' },
  { id: 'expresso', label: 'Expresso', subtitle: '1-2 dias úteis', amount: 59.9, imageUrl: '/vercel.svg', hasInsurance: true },
];


