import { Kode_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-kode-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Frankie",
    template: "%s · Frankie",
  },
  description: "Painel pessoal: jogos e livros, lidos direto do Notion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${kodeMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-mono text-fg">
        <Sidebar />
        <main className="min-h-dvh px-6 py-4 md:pl-28">{children}</main>
      </body>
    </html>
  );
}
