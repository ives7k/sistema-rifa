import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Campaign from "@/components/Campaign";
import MyTicketsBar from "@/components/MyTicketsBar";
import PurchaseSection from "@/components/PurchaseSection";
import Prizes from "@/components/Prizes";
import Regulation from "@/components/Regulation";
import Footer from "@/components/Footer";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/campaign', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && json.settings?.imageUrl) setImageUrl(json.settings.imageUrl);
      } catch {}
    })();
  }, []);

  const banner = imageUrl ?? "https://s3.incrivelsorteios.com/redimensiona?key=600x600/20250731_688b54af15d40.jpg";

  return (
    <div className="bg-[#ebebeb]"> 
      <Header />
      
      {/* Container para Banner */}
      <div className="relative">
        <div className="h-[300px] w-full">
          <div className="relative h-full w-full">
            <Image
              src={banner}
              alt="Prêmio"
              fill
              priority
              className="object-cover object-center"
            />
            {/* Gradiente que cobre a metade inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        </div>
        {/* Texto da campanha sobreposto */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
            <Campaign />
        </div>
      </div>
      
      {/* Container principal de conteúdo */}
      <div className="container mx-auto max-w-lg px-4 mt-2 space-y-2">
        <MyTicketsBar />
        <PurchaseSection />
        <Regulation />
        <Prizes />
      </div>
      
      <Footer />
    </div>
  );
}
