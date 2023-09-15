import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@lib/supabase.ts";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const user = await supabase.auth
    .getSession()
    .then(({ data: { session } }) => session?.user);

  if (user && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/profil", req.url));
  }

  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/profil"],
};
