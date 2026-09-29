"use client";

import { useState, type FormEvent } from "react";
import { newsletter } from "@/content/site";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { emailError } from "@/lib/a11y/form-errors";
import { cn } from "@/lib/utils";

type Props = { compact?: boolean; source?: string; className?: string; variant?: "box" | "line" };

export function NewsletterForm({ compact = false, source = "site", className, variant = "box" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = ((new FormData(form).get("email") as string) ?? "").trim();
    const problem = emailError(email);
    if (problem) {
      // Said in text under the field, and focus goes back to the field.
      setStatus("error");
      setMessage(problem);
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (data.ok) {
        setStatus("done");
        setMessage(newsletter.success);
        form.reset();
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-success", className)} role="status">
        <CheckIcon /> {message}
      </p>
    );
  }

  const id = `newsletter-${source}`;
  const errorId = `${id}-error`;
  const hasError = status === "error";
  const field = { "aria-invalid": hasError ? true : undefined, "aria-describedby": hasError ? errorId : undefined } as const;
  const busy = status === "loading";

  if (variant === "line") {
    return (
      <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
        <label htmlFor={id} className="sr-only">
          Email address (required)
        </label>
        <div className="flex items-end gap-4 border-b border-ink">
          <input id={id} type="email" name="email" required autoComplete="email" placeholder={newsletter.placeholder} className="input-line border-b-0 text-lg" {...field} />
          <button
            type="submit"
            aria-disabled={busy}
            onClick={(e) => busy && e.preventDefault()}
            className="group inline-flex shrink-0 items-center gap-2 pb-3 text-[0.68rem] tracking-luxe uppercase text-ink aria-disabled:opacity-50"
          >
            {newsletter.cta} <ArrowRightIcon width={14} height={14} className="transition-transform duration-500 group-hover:translate-x-1" />
          </button>
        </div>
        {hasError && (
          <p id={errorId} className="mt-2 text-xs text-danger" role="alert">
            <span className="font-medium">Error:</span> {message}
          </p>
        )}
        <p className="mt-4 max-w-md text-xs leading-relaxed text-plum">{newsletter.legal}</p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full", className)}>
      <div className={cn("flex gap-2", compact ? "max-w-sm" : "mx-auto max-w-md")}>
        <label htmlFor={id} className="sr-only">
          Email address (required)
        </label>
        <input id={id} type="email" name="email" required autoComplete="email" placeholder={newsletter.placeholder} className="input-lb" {...field} />
        <button
          type="submit"
          aria-disabled={busy}
          onClick={(e) => busy && e.preventDefault()}
          className={cn("btn btn-primary shrink-0 aria-disabled:opacity-50", compact ? "px-4" : "px-6")}
          aria-label={compact ? newsletter.cta : undefined}
        >
          {compact ? <ArrowRightIcon /> : newsletter.cta}
        </button>
      </div>
      {hasError && (
        <p id={errorId} className="mt-2 text-xs text-danger" role="alert">
          <span className="font-medium">Error:</span> {message}
        </p>
      )}
      {!compact && <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-plum">{newsletter.legal}</p>}
    </form>
  );
}
