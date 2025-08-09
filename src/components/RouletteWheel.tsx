'use client';

import { useMemo, useRef, useState } from 'react';

type Slice = {
  label: string;
  color: string;
};

interface RouletteWheelProps {
  slices?: Slice[];
  onFinish?: (slice: Slice, index: number) => void;
}

export default function RouletteWheel({
  slices = [
    { label: '5% OFF', color: '#f87171' },
    { label: 'Tente de novo', color: '#60a5fa' },
    { label: 'R$ 10 OFF', color: '#34d399' },
    { label: 'Tente de novo', color: '#fbbf24' },
    { label: 'R$ 20 OFF', color: '#a78bfa' },
    { label: 'Tente de novo', color: '#fb7185' },
  ],
  onFinish,
}: RouletteWheelProps) {
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const transitionMs = 4000;
  const wheelRef = useRef<HTMLDivElement | null>(null);

  const segmentAngle = 360 / slices.length;

  const gradient = useMemo(() => {
    // Build a conic-gradient with equal slices
    // e.g., "conic-gradient(color0 0deg Xdeg, color1 Xdeg Ydeg, ...)"
    let currentAngle = 0;
    const parts: string[] = [];
    for (let i = 0; i < slices.length; i += 1) {
      const nextAngle = currentAngle + segmentAngle;
      parts.push(`${slices[i].color} ${currentAngle}deg ${nextAngle}deg`);
      currentAngle = nextAngle;
    }
    return `conic-gradient(${parts.join(', ')})`;
  }, [slices, segmentAngle]);

  function computeIndexFromRotation(totalRotationDeg: number): number {
    // In CSS conic-gradient, 0deg = right, 90deg = top.
    // Pointer is at top, so we sample the color at 90deg.
    // Rotating the wheel by +theta moves the gradient, so the effective
    // angle under pointer is (90 - theta) mod 360.
    const theta = ((totalRotationDeg % 360) + 360) % 360;
    const effectiveAngle = ((90 - theta) % 360 + 360) % 360; // [0,360)
    const index = Math.floor(effectiveAngle / segmentAngle);
    // Guard rails
    return Math.max(0, Math.min(slices.length - 1, index));
  }

  function handleSpin() {
    if (isSpinning) return;
    setIsSpinning(true);
    setResultIndex(null);

    const extraSpins = 5; // full rotations
    const randomAngle = Math.random() * 360; // 0..360
    const nextRotation = rotationDeg + extraSpins * 360 + randomAngle;
    setRotationDeg(nextRotation);

    window.setTimeout(() => {
      const index = computeIndexFromRotation(nextRotation);
      setResultIndex(index);
      setIsSpinning(false);
      onFinish?.(slices[index], index);
    }, transitionMs + 50);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
          <div
            className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-red-500 drop-shadow"
            aria-hidden
          />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-[300px] h-[300px] rounded-full shadow-lg"
          style={{
            background: gradient,
            transition: `transform ${transitionMs}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
            transform: `rotate(${rotationDeg}deg)`,
          }}
          role="img"
          aria-label="Roleta de prêmios"
        />

        {/* Labels (overlay) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative w-[300px] h-[300px]">
            {slices.map((slice, i) => {
              const angle = i * segmentAngle + segmentAngle / 2; // center of slice
              return (
                <div
                  key={slice.label + i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px] font-semibold text-white drop-shadow"
                  style={{
                    transform: `rotate(${angle}deg) translate(0, -110px) rotate(${-angle}deg)`,
                    width: 90,
                    textAlign: 'center',
                  }}
                >
                  {slice.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed shadow hover:bg-red-700 transition-colors"
      >
        {isSpinning ? 'Girando...' : 'Girar roleta'}
      </button>

      {resultIndex !== null && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Resultado</p>
          <p className="text-xl font-bold">{slices[resultIndex].label}</p>
        </div>
      )}
    </div>
  );
}


