import type { Metadata } from "next";

export const siteConfig = {
  name: "SimpleInvoice",
  description: "Manage and track your organization's bills",
  shortName: "SI",
} as const;

export const siteMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Invoice", "Billing", "Finance", "Business", "SimpleInvoice", "Management"],
  authors: [{ name: "SimpleInvoice Team" }],
  creator: "SimpleInvoice",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simpleinvoice.com",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@simpleinvoice",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
