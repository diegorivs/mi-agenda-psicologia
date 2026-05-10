import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mediblock",
  description: "Plataforma de gestión clínica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* EL NAVBAR GLOBAL FUE RETIRADO DE AQUÍ */}
        
        {/* 3. EL RESTO DE LAS PANTALLAS SE INYECTA AQUÍ ABAJO */}
        <main className="flex-grow">
          {children}
        </main>

      </body>
    </html>
  );
}