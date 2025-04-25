import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { apiGet } from "./lib/api";
import { User } from "./lib/types/user";

const authURL = ["/login", "/register"];
const privateURL = ["/cart", "/me", "/order"];
const adminURL = ["/admin"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const url = request.nextUrl.pathname;
  console.log("url", url);
  if (authURL.some((path) => url.includes(path)) && accessToken)
    return NextResponse.redirect(new URL("/", request.url));
  if (privateURL.some((path) => url.includes(path)) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (adminURL.some((path) => url.includes(path))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const res = await apiGet<User>("/auth/get-me", {
        Cookie: `accessToken=${accessToken.value}`,
      });
      const user = res.data;
      console.log(user);
      if (!user || user.type !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/register", "/cart", "/me", "/order", "/admin/:path*"],
};
