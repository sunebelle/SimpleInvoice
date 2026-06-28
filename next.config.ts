import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/config/security-headers";

const nextConfig: NextConfig = {
  async headers() {
    const securityHeaders = buildSecurityHeaders(
      process.env.NODE_ENV === "production",
    );

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
