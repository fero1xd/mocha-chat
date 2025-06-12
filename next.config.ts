import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/((?!api/).*)",
        destination: "/static-shell",
      },
    ];
  },
};

export default nextConfig;
