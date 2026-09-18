import type { Metadata } from "next";
import { Poppins, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeleHealth — Verified Doctors & Online Consultations",
  description: "Consult with verified specialists, book video appointments, and manage prescriptions securely from home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${notoSansBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}