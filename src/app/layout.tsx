import type { Metadata, Viewport } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import StoreLayout from "./store/StoreLayout";

const bebas = Bebas_Neue({ subsets: ["latin", "latin-ext"], weight: '400' });

export const metadata: Metadata = {
  title: "O-Complex",
  description: "O-Complex",
  // metadataBase: new URL(''),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'ru-RU': '/ru-RU',
    },
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: [{ rel: 'icon', url: Favicon.src }],
  openGraph: {
    title: "",
    description: "",
    images: '',
    type: "website",
    locale: 'ru-RU',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru-Ru">
      <StoreLayout>
        <body className={bebas.className}>{children}</body>
      </StoreLayout>
    </html>
  );
}
