import { NextResponse } from "next/server";

/**
 * GET /api/tse/status
 * Diagnose Fiskaly TSE setup. Returns org state and actionable guidance.
 */
export async function GET() {
  const apiKey = process.env.FISKALY_API_KEY;
  const apiSecret = process.env.FISKALY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ ok: false, error: "401 Missing credentials" }, { status: 401 });
  }

  try {
    const res = await fetch("https://kassensichv-middleware.fiskaly.com/api/v2/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
    });
    const authText = await res.text();
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: authText || `${res.status}` }, { status: res.status });
    }
    const authData = authText ? JSON.parse(authText) : {};
    const token = authData.access_token || authData.token;

    const listRes = await fetch("https://kassensichv-middleware.fiskaly.com/api/v2/tss", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tssText = await listRes.text();
    if (!listRes.ok) {
      return NextResponse.json({ ok: false, error: tssText || `${listRes.status}` }, { status: listRes.status });
    }
    const tssData = tssText ? JSON.parse(tssText) : {};
    const tssList = tssData.data || [];

    const summary = tssList.map((t) => ({
      id: t._id,
      state: t.state,
      hasClient: null,
    }));

    for (let i = 0; i < summary.length; i++) {
      const cr = await fetch(
        `https://kassensichv-middleware.fiskaly.com/api/v2/tss/${summary[i].id}/client`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (cr.ok) {
        const cd = await cr.json();
        const clients = cd.data || cd.clients || [];
        summary[i].hasClient = clients.length > 0;
        summary[i].clientCount = clients.length;
      } else {
        summary[i].hasClient = false;
      }
    }

    const usable = summary.find((s) => s.hasClient);
    const addable = summary.find(
      (s) => (s.state === "UNINITIALIZED" || s.state === "INITIALIZED") && !s.hasClient
    );
    const createdNoClient = summary.find((s) => s.state === "CREATED" && !s.hasClient);

    return NextResponse.json({
      ok: !!usable,
      auth: "OK",
      tss: summary,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
