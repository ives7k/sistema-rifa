import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wesley Alemão Clone",
  description: "Clone do site de campanha Wesley Alemão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('gesturestart', function (e) {
                e.preventDefault();
              });
              document.addEventListener('dblclick', function (e) {
                e.preventDefault();
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
