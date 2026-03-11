import "./globals.css";
import { Providers } from "./providers";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Inter, Inter_Tight } from "next/font/google";
import { ConditionalLayout } from "./components/conditional-layout";
import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_PAGE_KEYWORDS,
  DEFAULT_PAGE_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/utils/metadata.utils";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const displayFont = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: `${SITE_NAME} | ${DEFAULT_PAGE_TITLE}`,
  description: DEFAULT_PAGE_DESCRIPTION,
  keywords: DEFAULT_PAGE_KEYWORDS,
  category: "finance",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${DEFAULT_PAGE_TITLE}`,
    description: DEFAULT_PAGE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | ${DEFAULT_PAGE_TITLE}`,
    description: DEFAULT_PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} min-h-screen bg-custom-gradient text-foreground antialiased`}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
