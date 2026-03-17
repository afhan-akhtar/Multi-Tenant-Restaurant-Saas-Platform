import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getPublicPaymentConfig } from "@/lib/payments/config";

export async function GET(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(getPublicPaymentConfig());
  } catch (error) {
    console.error("[payments config]", error);
    return NextResponse.json({ error: "Failed to load payment settings." }, { status: 500 });
  }
}
