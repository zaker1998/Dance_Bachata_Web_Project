import type { NextConfig } from "next";

// Content Security Policy.
//
// `'unsafe-inline'` for styles is required because Tailwind v4 / Next inject
// inline <style> tags. `'unsafe-inline'` for scripts is needed for Next's
// runtime / JSON-LD blob. The frame-src / img-src / connect-src entries are
// scoped to exactly what the site loads: YouTube embeds, Supabase, Resend.
const supabaseHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co"
    ).origin;
  } catch {
    return "https://*.supabase.co";
  }
})();

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https://i.ytimg.com https://img.youtube.com`,
  `font-src 'self' data:`,
  `frame-src https://www.youtube.com https://www.youtube-nocookie.com`,
  `connect-src 'self' ${supabaseHost} https://www.youtube.com https://www.youtube-nocookie.com`,
  `frame-ancestors 'self'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
].join("; ");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
