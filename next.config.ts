import type { NextConfig } from "next";
import { config } from "./config.env";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    if (!config.NEXT_PUBLIC_GRAPH_API) {
      throw new Error("NEXT_PUBLIC_GRAPH_API is not defined");
    }

    return [
      {
        source: "/graphql",
        destination: config.NEXT_PUBLIC_GRAPH_API,
      },
      {
        source: "/logout",
        destination: `${config.NEXT_PUBLIC_GRAPH_API}/logout`,
      },
    ];
  },
};

export default nextConfig;
