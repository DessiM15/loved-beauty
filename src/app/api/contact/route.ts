import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Contact form handler.
 * Sends via Resend when RESEND_API_KEY is set (free tier covers this volume).
 * Without a key it logs the message so the demo still works.
 */
export async function POST(req: Request) {
  let data: Record<string, string> = {};
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill every field.
  if (data.website) return NextResponse.json({ ok: true });

  const name = (data.name ?? "").trim().slice(0, 120);
  const email = (data.email ?? "").trim().slice(0, 200);
  const topic = (data.topic ?? "").trim().slice(0, 80);
  const order = (data.order ?? "").trim().slice(0, 40);
  const message = (data.message ?? "").trim().slice(0, 4000);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, message: "Please fill in your name, email and message." }, { status: 400 });
  }

  const text = [`From: ${name} <${email}>`, `Topic: ${topic}`, order ? `Order: ${order}` : null, "", message].filter((l) => l !== null).join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contact] (no RESEND_API_KEY set)\n" + text);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Loved Beauty Website <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? site.supportEmail],
      reply_to: email,
      subject: `[Website] ${topic || "New message"} from ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("contact/resend", await res.text());
    return NextResponse.json({ ok: false, message: "We couldn't send your message. Please email us directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
