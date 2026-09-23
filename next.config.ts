import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  agentRules: false,
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
