import type { ReactNode } from 'react';

// Layout aninhado do diretório /admin não deve criar uma nova árvore <html>/<body>.
// Mantemos apenas um wrapper leve para herdar o tema do RootLayout.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}


