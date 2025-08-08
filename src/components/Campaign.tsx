// src/components/Campaign.tsx
import { useEffect, useState } from 'react';
import { getCampaignSettings } from '@/lib/campaign';

interface CampaignSettings {
  title: string;
  imageUrl: string;
}

const Campaign = () => {
  const [settings, setSettings] = useState<CampaignSettings | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await getCampaignSettings();
        setSettings(s);
      } catch {}
    })();
  }, []);

  const title = settings?.title ?? 'EDIÇÃO 76 - NOVO TERA 2026 0KM';

  return (
    <section className="text-white text-left">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-md animate-pulse">Adquira já!</span>
          <span className="text-xs font-semibold bg-black/40 px-2 py-1 rounded-md">15414.643737/2025-93</span>
        </div>
        <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>
    </section>
  );
};

export default Campaign;
