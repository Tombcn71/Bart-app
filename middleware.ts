import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const hostname = request.headers.get("host") || "";
  const currentHost = hostname.replace(/:.*$/, "");

  // 1. Static bestanden
  if (/\.(png|jpg|jpeg|svg|ico)$/.test(pathname)) return NextResponse.next();

  // 2. Vercel Test Routes
  if (pathname.startsWith("/offerte-test")) {
    url.pathname = pathname.replace("/offerte-test", "/configurators/kozijnen");
    return NextResponse.rewrite(url);
  }
  if (pathname.startsWith("/admin-test")) {
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  // 3. Admin Subdomein (admin.budgetkozijnenshop.nl)
  if (currentHost.startsWith("admin.")) {
    url.pathname = pathname.startsWith("/admin")
      ? pathname
      : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 4. Offerte Subdomein (offerte.budgetkozijnenshop.nl)
  if (currentHost.startsWith("offerte.")) {
    url.pathname =
      pathname === "/"
        ? "/configurators/kozijnen"
        : `/configurators${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
