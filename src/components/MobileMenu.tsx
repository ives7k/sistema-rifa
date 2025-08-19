// src/components/MobileMenu.tsx
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* O disparo é controlado no Header; aqui usamos apenas o conteúdo */}
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="p-4">
          <ul className="space-y-2">
            <li><Button asChild variant="ghost" className="w-full justify-start" onClick={onClose}><Link href="/">Início</Link></Button></li>
            <li><Button asChild variant="ghost" className="w-full justify-start" onClick={onClose}><Link href="/campanhas">Campanhas</Link></Button></li>
            <li><Button asChild variant="ghost" className="w-full justify-start" onClick={onClose}><Link href="/meus-titulos">Meus títulos</Link></Button></li>
            <li><Button asChild variant="ghost" className="w-full justify-start" onClick={onClose}><Link href="/ganhadores">Ganhadores</Link></Button></li>
            <li><Button asChild variant="ghost" className="w-full justify-start" onClick={onClose}><Link href="/contato">Suporte</Link></Button></li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
