import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Team photos are loaded from the companies' own sites, never copied here.
  images: {
    remotePatterns: [
      new URL("https://www.greenholidaytravels.com/wp-content/uploads/**"),
      new URL("https://assets.reddottours.com/meet-the-team/**"),
      new URL("https://www.bluelankatours.com/wp-content/uploads/**"),
    ],
  },
  // The dashboard opens on the view that compares all three companies.
  async redirects() {
    return [{ source: "/", destination: "/all", permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
