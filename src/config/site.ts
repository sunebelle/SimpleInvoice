import type { Metadata } from "next";

export const siteConfig = {
  name: "SimpleInvoice",
  description: "Manage and track your organization's bills",
  shortName: "SI",
} as const;

export const siteMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};
