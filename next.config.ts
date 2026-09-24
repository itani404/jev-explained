import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // github.com/<user>.png redirects to avatars.githubusercontent.com
    remotePatterns: [
      { protocol: "https", hostname: "github.com", pathname: "/*.png" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
