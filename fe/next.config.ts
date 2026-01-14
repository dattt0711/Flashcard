import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "http://172.20.10.3:3000",
    "http://172.20.10.*:3000",
    "http://192.168.*.*:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
