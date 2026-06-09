import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

console.log("NODE_ENV =", process.env.NODE_ENV);

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ["192.168.0.100"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withPWA(nextConfig);