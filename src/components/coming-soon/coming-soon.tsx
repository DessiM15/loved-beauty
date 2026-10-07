"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { comingSoon as copy } from "@/content/coming-soon";
import { site } from "@/content/site";
import { emailError } from "@/lib/a11y/form-errors";
import "./coming-soon.css";

/**
 * The launch page: Full screen · Dark · Dramatic reveal (the client's pick, 7 Oct 2026).
 * The film fills the window and loops; the logo, countdown and signup float on it.
 * When the film ends the screen falls to black and "Coming Soon" arrives letter by
 * letter, then the film starts again. The headline is only ever shown that way, but
 * it is always present for screen readers.
 */

const UNITS = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Minutes"],
  ["s", "Seconds"],
] as const;

type Unit = (typeof UNITS)[number][0];
type Parts = Record<Unit, string>;

const ZERO: Parts = { d: "00", h: "00", m: "00", s: "00" };
const TARGET = new Date(copy.launchAt).getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function partsAt(now: number): Parts {
  const s = Math.max(0, Math.floor((TARGET - now) / 1000));
  return { d: pad(Math.floor(s / 86400)), h: pad(Math.floor((s % 86400) / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) };
}

export function ComingSoon() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [parts, setParts] = useState<Parts>(ZERO);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [finale, setFinale] = useState(false);
  const [ending, setEnding] = useState(false);
  const endingRef = useRef(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");

  // The countdown.
  useEffect(() => {
    const tick = () => setParts(partsAt(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // The window behind the page is black too, so nothing cream shows on overscroll.
  useEffect(() => {
    const root = document.documentElement;
    const before = root.style.backgroundColor;
    root.style.backgroundColor = "#0b0908";
    return () => {
      root.style.backgroundColor = before;
    };
  }, []);

  // The film: starts silent (React does not write the muted attribute, so it is set here),
  // pinches in for its end card on wide screens, and stages its ending instead of looping on its own.
  useEffect(() => {
    const v = videoRef.current;
    const cs = v?.closest<HTMLElement>(".cs");
    if (!v || !cs) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    v.muted = true;
    v.defaultMuted = true;
    const sync = () => {
      setPaused(v.paused);
      setMuted(v.muted);
    };
    const timers: number[] = [];
    let raf = 0;

    const setEndingState = (on: boolean) => {
      endingRef.current = on;
      setEnding(on);
    };

    // On a wide screen the film is cropped to a band and its end-card wordmark falls below the
    // bottom edge. Here the film shrinks and lifts so the whole wordmark fits in the clear space
    // between the credit line and the bottom of the window.
    const stageEnding = () => {
      const W = cs.clientWidth;
      const H = cs.clientHeight;
      const { wordmark } = copy.endCard;
      if (W / H > 9 / 16) {
        const filmH = (W * 16) / 9;
        const top = 0.26 * (H - filmH); // mirrors the CSS crop
        const wmCenter = (wordmark.top + wordmark.bottom) / 2;
        const wmH = (wordmark.bottom - wordmark.top) * filmH;
        const panel = cs.querySelector<HTMLElement>(".cs-panel");
        const panelBottom = panel ? panel.getBoundingClientRect().bottom - cs.getBoundingClientRect().top : H * 0.75;
        let zoneTop = panelBottom + 12;
        let zoneBottom = H - 16;
        if (zoneBottom - zoneTop < 60) {
          zoneTop = H - 120;
          zoneBottom = H - 16;
        }
        const scale = Math.min(1, Math.max(0.2, ((zoneBottom - zoneTop) * 0.8) / wmH));
        const from = top + wmCenter * filmH;
        const to = (zoneTop + zoneBottom) / 2;
        cs.style.setProperty("--end-origin", `${(wmCenter * 100).toFixed(2)}%`);
        cs.style.setProperty("--end-scale", scale.toFixed(3));
        cs.style.setProperty("--end-dy", `${(to - from).toFixed(1)}px`);
      } else {
        // Taller than the film (phones): the frame is cropped at the sides, so the film only
        // shrinks until the wordmark fits the width with a little room, staying where it is.
        const visible = W / H / (9 / 16);
        const scale = Math.min(1, (0.92 * visible) / (wordmark.right - wordmark.left));
        cs.style.setProperty("--end-origin", `${(((wordmark.top + wordmark.bottom) / 2) * 100).toFixed(2)}%`);
        cs.style.setProperty("--end-scale", scale.toFixed(3));
        cs.style.setProperty("--end-dy", "0px");
      }
      setEndingState(true);
    };

    const watch = () => {
      if (!endingRef.current && v.currentTime >= copy.endCard.at) stageEnding();
      raf = window.requestAnimationFrame(watch);
    };
    const onPlay = () => {
      sync();
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(watch);
    };
    const onPause = () => {
      sync();
      window.cancelAnimationFrame(raf);
    };

    const restart = () => {
      setEndingState(false);
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    const onEnded = () => {
      window.cancelAnimationFrame(raf);
      const typing = formRef.current?.contains(document.activeElement) ?? false;
      if (typing) return restart();
      setFinale(true);
      const hold = reduced ? 3200 : copy.revealMs;
      // The film snaps back to full size while the black ending still covers it.
      timers.push(window.setTimeout(() => setEndingState(false), hold - 300));
      timers.push(window.setTimeout(() => setFinale(false), hold));
      timers.push(window.setTimeout(restart, hold + 500));
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", sync);
    v.addEventListener("ended", onEnded);
    sync();
    if (!reduced) v.play().catch(() => {});
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", sync);
      v.removeEventListener("ended", onEnded);
      window.cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("firstName") ?? "").trim();
    const problem = emailError(email);
    if (problem) {
      setStatus("error");
      setMessage(problem);
      emailRef.current?.focus();
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: name, source: "coming-soon" }),
      });
      const result = (await res.json()) as { ok: boolean; message?: string };
      if (result.ok) {
        setFirstName(name);
        setStatus("done");
      } else {
        setStatus("error");
        setMessage(result.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const hasError = status === "error";
  const busy = status === "loading";

  return (
    <div className={`cs${finale ? " is-finale" : ""}${ending ? " is-ending" : ""}`} data-testid="coming-soon">
      <main id="main" className="cs-in" tabIndex={-1}>
        <div className="cs-film">
          <video
            ref={videoRef}
            src={copy.film.src}
            poster={copy.film.poster}
            playsInline
            preload="auto"
            aria-label={copy.film.label}
          />
          <div className="cs-scrim" aria-hidden="true" />
        </div>

        <div className="cs-panel">
          <div className="cs-top">
            {/* Plain img: the file is the exact brand asset and must not be recompressed. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="cs-logo" src={copy.logo} alt={site.name} width={900} height={257} />
          </div>
          <div className="cs-body">
            <h1 className="cs-soon">
              <span className="lead">{copy.headline.lead}</span>
              <span className="acc">{copy.headline.accent}</span>
            </h1>
            <p className="cs-sub">{copy.subhead}</p>
            <ul className="cs-count" aria-label="Time until launch">
              {UNITS.map(([key, label]) => (
                <li key={key}>
                  <b>{parts[key]}</b>
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            {status === "done" ? (
              <p className="cs-done" role="status">
                <strong>
                  {copy.form.done}
                  {firstName ? `, ${firstName}.` : "."}
                </strong>
                <span>{copy.form.doneText}</span>
              </p>
            ) : (
              <form ref={formRef} className="cs-form" onSubmit={onSubmit} noValidate>
                <label className="sr-only" htmlFor="cs-name">
                  {copy.form.firstName}
                </label>
                <input id="cs-name" name="firstName" type="text" autoComplete="given-name" placeholder={copy.form.firstName} maxLength={60} />
                <label className="sr-only" htmlFor="cs-email">
                  {copy.form.email} (required)
                </label>
                <input
                  ref={emailRef}
                  id="cs-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={copy.form.email}
                  required
                  aria-invalid={hasError ? true : undefined}
                  aria-describedby={hasError ? "cs-err" : undefined}
                />
                <button type="submit" aria-disabled={busy} onClick={(e) => busy && e.preventDefault()}>
                  {busy ? "One moment" : copy.form.cta}
                </button>
                {hasError && (
                  <p className="cs-err" id="cs-err" role="alert">
                    <strong>Error:</strong> {message}
                  </p>
                )}
                <p className="cs-fine">{copy.form.legal}</p>
              </form>
            )}

            <div className="cs-foot">
              <div className="cs-social">
                <a href={site.social.instagram} target="_blank" rel="noopener" aria-label={`${site.name} on Instagram (opens in a new tab)`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href={site.social.tiktok} target="_blank" rel="noopener" aria-label={`${site.name} on TikTok (opens in a new tab)`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.4 3c.3 2.2 1.6 3.7 3.6 4v3c-1.3 0-2.5-.4-3.6-1.1v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.8 2.5V3h3z" />
                  </svg>
                </a>
              </div>
              <p className="cs-credit">{copy.credit}</p>
            </div>
          </div>
        </div>

        <div className="cs-ctl">
          <button type="button" onClick={togglePlay} aria-label={paused ? "Play the film" : "Pause the film"}>
            {paused ? (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4.5 2.5v11l9-5.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <rect x="3.5" y="2.5" width="3" height="11" />
                <rect x="9.5" y="2.5" width="3" height="11" />
              </svg>
            )}
          </button>
          <button type="button" onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
            {muted ? (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" />
                <path d="M10.5 6l4 4M14.5 6l-4 4" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M2 6h2.5L8 3v10L4.5 10H2z" fill="currentColor" />
                <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.3 3.6a6 6 0 0 1 0 8.8" />
              </svg>
            )}
          </button>
        </div>

        {/* The ending. Decorative: the real headline is in the panel above. */}
        <div className="cs-finale" aria-hidden="true">
          <div className="f-lead">
            {copy.headline.lead
              .toUpperCase()
              .split("")
              .map((ch, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  {ch}
                </span>
              ))}
          </div>
          <div className="f-acc">{copy.headline.accent}</div>
          <div className="f-rule" />
        </div>
      </main>
    </div>
  );
}
