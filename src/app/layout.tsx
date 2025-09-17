import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReUse! Web",
  description: "Plataforma web para agendar coletas e consultar pontos de descarte.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b border-white/10">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">ReUse!</a>
            <nav className="flex gap-4 text-sm">
              <a href="/points" className="link">Pontos de coleta</a>
              <a href="/auth/sign-in" className="link">Entrar</a>
              <a href="/auth/sign-up" className="btn">Criar conta</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-10 text-sm text-white/60">
          © {new Date().getFullYear()} ReUse!
        </footer>
      </body>
    </html>
  );
}
