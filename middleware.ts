import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAuthenticated } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    console.log(`===> Received ${request.method} request to ${request.url} at ${new Date()}`);

    const auth = await isAuthenticated(request); 

    if (!auth) {
    // If not, redirect to the login page
    console.log("Not authenticated");
    return NextResponse.redirect(new URL("/login", request.nextUrl).href);
  }
  return NextResponse.next(); // Continue to the next Middleware or route handler
}

export const config = {
  matcher: ["/api/:path*"],
};
