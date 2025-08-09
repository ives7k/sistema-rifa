'use client';

interface PromoTitleProps {
  text?: string;
  subtitle?: string;
}

export default function PromoTitle({ text = 'Roleta da Sorte', subtitle }: PromoTitleProps) {
  return (
    <div className="w-full text-center">
      <div className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white shadow-lg">
        <i className="bi bi-stars text-xl" aria-hidden />
        <span className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider drop-shadow">
          {text}
        </span>
        <i className="bi bi-lightning-charge-fill text-xl" aria-hidden />
        <span className="pointer-events-none absolute -z-10 inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400" />
      </div>

      {subtitle && (
        <p className="mt-3 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}


