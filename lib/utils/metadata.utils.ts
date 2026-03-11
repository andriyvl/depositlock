import type { Metadata } from "next";

export const SITE_NAME = "DepositLock";
export const SITE_URL = "https://depositlock.devviy.com";
export const DEFAULT_PAGE_TITLE = "On-chain rental deposit escrow";
export const DEFAULT_PAGE_DESCRIPTION =
  "Create, fund, and manage crypto rental deposit escrow agreements for bikes, flats, equipment, transport, and other rental flows across Ethereum and supported L2 networks.";
export const DEFAULT_PAGE_KEYWORDS = [
  "rental deposit escrow",
  "crypto rental deposits",
  "on-chain escrow",
  "Ethereum escrow",
  "L2 escrow",
  "stablecoin escrow",
  "USDC escrow",
  "USDT escrow",
  "non-custodial escrow",
  "rental business deposits",
];

interface PageMetadataConfig {
  title?: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
}: PageMetadataConfig): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${DEFAULT_PAGE_TITLE}`;

  return {
    title: pageTitle,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
    },
  };
}
