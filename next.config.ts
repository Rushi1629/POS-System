import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

// The PWA service worker exists for the browser deployment. It is switched off for native
// (Capacitor) builds: inside the Android WebView that worker runs on the https://localhost
// origin and keeps its own precache of the app shell, so after an APK update it can keep
// serving the previous index.html and JS bundles - users stay on the old build even though
// they installed the new one.
const isNativeBuild = process.env.CAPACITOR_BUILD === "1";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development" || isNativeBuild,
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.103"],
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPWA(nextConfig);
