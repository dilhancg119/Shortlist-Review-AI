import type { MetadataRoute } from "next";

/** Lets the dashboard be added to a phone's home screen and open full screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shortlist Review",
    short_name: "Shortlist",
    description: "Compares three shortlisted tour operators as booking system prospects.",
    start_url: "/all",
    display: "standalone",
    background_color: "#f9fafc",
    theme_color: "#f2f3f7",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
