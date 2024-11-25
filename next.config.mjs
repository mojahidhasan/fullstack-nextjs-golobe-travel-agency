/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self' https://vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live;
    connect-src https://vercel.live wss://ws-us3.pusher.com;
    style-src 'self' 'unsafe-inline' https://vercel.live;
    img-src 'self' blob: data: https://images.unsplash.com/ https://platform-lookaside.fbsbx.com/ https://vercel.live https://vercel.com;
    frame-src https://vercel.live;
    font-src 'self' https://vercel.live https://assets.vercel.com;
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "golob-travel-agency.vercel.app",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "www.airplane-pictures.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Pathname",
            value: "/:path*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
