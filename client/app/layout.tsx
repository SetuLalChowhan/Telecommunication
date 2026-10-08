import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { baseMetadata, siteJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a1e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} ${notoSansBengali.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background font-sans text-foreground selection:bg-[#97cde5]/30 selection:text-foreground"
        suppressHydrationWarning
      >
        {/* Site-wide Organization + WebSite graph. Rendered once, server-side. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
