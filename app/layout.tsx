import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Yoklama Sistemi",
  description: "Etkinlik ve derslere QR kod ile hızlı yoklama sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
