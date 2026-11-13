import type { MetadataRoute } from "next";

/** De web app van BartMooi: installeerbaar op het startscherm van de telefoon, met het eigen logo. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BartMooi",
    short_name: "BartMooi",
    description: "Offertes voor BartMooi",
    start_url: "/meten",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E5079",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
