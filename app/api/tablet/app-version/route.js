import { NextResponse } from "next/server";

/**
 * OTA / app store version check. Bump `recommended` when you ship a new native build.
 */
export async function GET() {
  return NextResponse.json({
    minSupported: "1.0.0",
    recommended: "1.0.0",
    otaManifestUrl: process.env.TABLET_OTA_MANIFEST_URL || null,
    updatedAt: new Date().toISOString(),
  });
}
