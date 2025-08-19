import type { ReactNode } from 'react';
import '../globals.css';
import './theme.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}


