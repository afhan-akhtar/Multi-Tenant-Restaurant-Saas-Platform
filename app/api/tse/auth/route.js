import { NextResponse } from "next/server";

/**
 * GET /api/tse/auth - Test Fiskaly auth only (no TSS required).
 * Use to verify API key/secret before resolving TSS setup.
 */
export async function GET() {
  const apiKey = process.env.FISKALY_API_KEY?.trim?.();
  const apiSecret = process.env.FISKALY_API_SECRET?.trim?.();

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ ok: false, error: "401 Missing credentials" }, { status: 401 });
  }

  try {
    const res = await fetch("https://kassensichv-middleware.fiskaly.com/api/v2/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message || data?.error || data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Auth OK",
      keyPrefix: apiKey.slice(0, 12) + "…",
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
