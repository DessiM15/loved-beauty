"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/ui/icons";

const topics = ["Order question", "Product question", "Wholesale / collaboration", "Something else"];

/**
 * Messages go through Web3Forms (web3forms.com), which emails them to the
 * address the access key was registered with. The free plan only accepts
 * submissions from the browser, so the key is public by design
 * (NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY) and the post happens here, not in an API
 * route. Restrict the key to the site's domain in the Web3Forms dashboard.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const FALLBACK = "Something went wrong. Please email us directly.";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot: bots fill every field. Pretend it worked and drop it.
    if (data.website) {
      setStatus("done");
      form.reset();
      return;
    }

    const name = data.name.trim();
    const email = data.email.trim();
    const topic = data.topic?.trim() || "New message";
    const order = data.order?.trim();

    if (!ACCESS_KEY) {
      console.info("[contact] (no NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY set)", data);
      setStatus("done");
      form.reset();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `[Loved Beauty website] ${topic} from ${name}`,
          from_name: "Loved Beauty website",
          name,
          email, // Web3Forms uses this as the reply-to, so a Gmail reply goes straight to the customer
          topic,
          order_number: order || "-",
          message: data.message.trim(),
        }),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && json.success) {
        setStatus("done");
        form.reset();
      } else {
        setStatus("error");
        setMessage(FALLBACK);
      }
    } catch {
      setStatus("error");
      setMessage(FALLBACK);
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blush text-rose-deep">
          <CheckIcon width={22} height={22} />
        </span>
        <p className="mt-4 font-serif text-2xl">Thank you.</p>
        <p className="mt-1 text-sm text-plum">We&rsquo;ve received your message and will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs tracking-wide2 uppercase">
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" className="input-lb" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs tracking-wide2 uppercase">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input-lb" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="topic" className="mb-1.5 block text-xs tracking-wide2 uppercase">
            Topic
          </label>
          <select id="topic" name="topic" className="input-lb appearance-none">
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="order" className="mb-1.5 block text-xs tracking-wide2 uppercase">
            Order number <span className="normal-case tracking-normal text-plum">(optional)</span>
          </label>
          <input id="order" name="order" className="input-lb" placeholder="#1001" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs tracking-wide2 uppercase">
          Message
        </label>
        <textarea id="message" name="message" required className="textarea-lb" />
      </div>
      {status === "error" && (
        <p className="text-sm text-danger" role="alert">
          {message}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
