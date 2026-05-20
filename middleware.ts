import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const hostname = request.headers.get("host") || "";
  const currentHost = hostname.replace(/:.*$/, "");

  // 🛠️ FIX: Laat alle bestanden met een afbeeldingsextensie DIRECT doorgaan
  // Zo zoekt Next.js altijd direct in de /public map!
  if (
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // 1. BEHEERDER: admin.website.com of admin.localhost
  if (currentHost.startsWith("admin.")) {
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. KLANT: offerte.website.com of offerte.localhost
  if (currentHost.startsWith("offerte.")) {
    // Als de klant op de homepage komt, sturen we ze naar het kozijnen-overzicht
    if (pathname === "/") {
      url.pathname = `/configurators/kozijnen`;
      return NextResponse.rewrite(url);
    }

    // Voor alle andere pagina's (/deuren, /schuifpui, /kozijnconfigurator/id etc.)
    url.pathname = `/configurators${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Scherpe matcher zodat Next.js interne bestanden sowieso overslaat
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
