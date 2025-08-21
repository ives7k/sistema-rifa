export const MAX_PIX_TOTAL_BR = 200; // Valor máximo por transação PIX (em reais)

export type FreightOption = {
  id: string;
  label: string;
  amount: number; // em reais
};

export const FREIGHT_OPTIONS_BR: FreightOption[] = [
  { id: 'pac', label: 'PAC (5-9 dias úteis)', amount: 24.9 },
  { id: 'sedex', label: 'SEDEX (2-4 dias úteis)', amount: 39.9 },
  { id: 'expresso', label: 'Expresso (1-2 dias úteis)', amount: 59.9 },
];


