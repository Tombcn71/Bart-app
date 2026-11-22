import { GeminiAssistent } from "@/app/test-assistent/GeminiAssistent";

export const metadata = { title: "Marleen", robots: { index: false, follow: false } };

/** Het venster dat via widget.js op bartmooi.nl verschijnt (in een iframe). */
export default function Widget() {
  return <GeminiAssistent ingebed />;
}
