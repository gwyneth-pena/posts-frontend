import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_GRAPH_API) {
      throw new Error("NEXT_PUBLIC_GRAPH_API is not defined");
    }

    return [
      {
        source: "/graphql",
        destination: process.env.NEXT_PUBLIC_GRAPH_API,
      },
    ];
  },
};

export default nextConfig;
