import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Handles Google OAuth redirect callback from Google Consent screen.
 * Exchanges the authorization code with the backend /google/connect endpoint
 * forwarding Better-Auth session cookies.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = request.nextUrl.origin;

  if (error || !code) {
    const reason = encodeURIComponent(error || "Authorization was denied");
    return NextResponse.redirect(
      new URL(`/doctor/settings?tab=integrations&google_error=${reason}`, baseUrl)
    );
  }

  try {
    const cookieStore = await cookies();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${apiUrl}/google/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.success === false) {
      const message = encodeURIComponent(
        data?.message || "Failed to link Google account with your schedule"
      );
      return NextResponse.redirect(
        new URL(`/doctor/settings?tab=integrations&google_error=${message}`, baseUrl)
      );
    }

    return NextResponse.redirect(
      new URL("/doctor/settings?tab=integrations&google_connected=true", baseUrl)
    );
  } catch (err: any) {
    const reason = encodeURIComponent(err.message || "Unexpected network error");
    return NextResponse.redirect(
      new URL(`/doctor/settings?tab=integrations&google_error=${reason}`, baseUrl)
    );
  }
}
