import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nativos Obras360",
  description: "Gestion y control inteligente de obra publica"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
