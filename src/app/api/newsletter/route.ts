import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/shopify";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; firstName?: string; source?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 400 });
  }
  try {
    const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 60) : "";
    const result = await subscribeEmail(email, firstName || undefined);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (e) {
    console.error("newsletter", e);
    return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
