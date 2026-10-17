import type { NextConfig } from "next";

const firebaseAuthHost =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "example-69600";

const nextConfig: NextConfig = {
  // Never ship browser source maps that could expose server/client source.
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Proxy Firebase Auth handler so authDomain can be usemeai.vercel.app
  // (Google then shows that domain instead of example-69600.firebaseapp.com).
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseAuthHost}.firebaseapp.com/__/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
