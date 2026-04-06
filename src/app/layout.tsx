import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProfileBanner from "./ProfileBanner";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talento Tech — Ingeniería Full-Stack Autónoma con IA",
  description: "Programa formativo de clase mundial: Desarrollo full-stack, orquestación de agentes IA, despliegue en producción y autonomía profesional. Desde cero hasta tu primer cliente.",
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
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
