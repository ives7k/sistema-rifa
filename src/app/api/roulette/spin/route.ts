import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SpinResponse = {
  success: true;
  idx: number;
  label: string;
  stopAngle: number;
};

// Mesmo mapeamento utilizado no componente WinwheelRoulette
const SEGMENT_LABELS = [
  '8 MIL REAIS',
  'TENTE OUTRA VEZ',
  '15 MIL REAIS',
  'CARRO 0KM',
  'TENTE OUTRA VEZ',
  '2 iPhone 16 Pro Max',
] as const;

const SIZES_DEG = [60, 60, 60, 60, 60, 60];
const BASE_START_DEG = 330; // primeiro segmento inicia em 330°

export async function POST() {
  try {
    // Sorteio seguro no servidor
    const idx = Math.floor(Math.random() * SIZES_DEG.length);

    // Calcula o início do segmento escolhido
    let start = BASE_START_DEG;
    for (let i = 0; i < idx; i += 1) start = (start + SIZES_DEG[i]) % 360;

    // Escolhe um ângulo interno ao segmento
    const angleWithin = Math.random() * SIZES_DEG[idx];
    const stopAngle = (start + angleWithin) % 360;

    const body: SpinResponse = {
      success: true,
      idx,
      label: SEGMENT_LABELS[idx],
      stopAngle,
    };
    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json({ success: false, message: 'spin_error' }, { status: 500 });
  }
}


