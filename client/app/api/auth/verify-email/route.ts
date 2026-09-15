import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:5000";

  try {
    const res = await fetch(
      `${backendUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const data = await res.json().catch(() => null);
      const userRole = data?.user?.role || data?.role || searchParams.get("role") || "";
      const redirectUrl = new URL("/verify-email", request.url);
      redirectUrl.searchParams.set("status", "success");
      if (userRole) {
        redirectUrl.searchParams.set("role", userRole);
      }
      return NextResponse.redirect(redirectUrl);
    } else {
      const data = await res.json().catch(() => null);
      const redirectUrl = new URL("/verify-email", request.url);
      redirectUrl.searchParams.set("status", "error");
      if (data?.message) {
        redirectUrl.searchParams.set("message", data.message);
      }
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error: any) {
    const redirectUrl = new URL("/verify-email", request.url);
    redirectUrl.searchParams.set("status", "error");
    redirectUrl.searchParams.set("message", "Network error during email verification.");
    return NextResponse.redirect(redirectUrl);
  }
}

