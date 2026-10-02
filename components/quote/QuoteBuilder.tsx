"use client";

import { useEffect, useId, useRef, useState } from "react";
import { QuotePreview } from "@/components/quote/QuotePreview";
import { WhatsAppIcon } from "@/components/ui/WhatsAppLink";
import { whatsappHref } from "@/lib/constants";
import type { ColorSwatch, QuoteContent, QuoteProductId } from "@/lib/types";

interface Opening {
  id: string;
  product: QuoteProductId;
  style: string;
  width: string;
  height: string;
  quantity: number;
  glass: string;
  color: string;
}

interface Details {
  name: string;
  phone: string;
  location: string;
  projectType: string;
  timeline: string;
  siteVisit: boolean;
  notes: string;
}

interface Draft {
  unit: string;
  openings: Opening[];
  details: Details;
}

interface QuoteBuilderProps {
  content: QuoteContent;
  colors: ColorSwatch[];
  whatsapp: string;
}

type Errors = Record<string, string>;

const STORAGE_KEY = "hitech-quote-draft-v1";
const MAX_QUANTITY = 99;
const NEPAL_MOBILE = /^9[678]\d{8}$/;

const PRODUCT_ICONS: Record<QuoteProductId, string> = {
  windows: "M4 4h16v16H4V4Zm8 0v16M4 12h16",
  doors: "M6 3h12v18H6V3Zm9 9.5v1",
  panels: "M4 4h16v16H4V4Zm4 0v16m4-16v16m4-16v16",
};

const SELECT_CHEVRON = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'><path d='M1 1.5 6 6.5 11 1.5' stroke='%231B1B1D' stroke-width='1.5' stroke-linecap='round'/></svg>\")",
};

const fieldClass = (invalid: boolean) =>
  `mt-2 w-full min-w-0 rounded-2xl bg-surface px-4 py-3 text-base text-charcoal outline-none ring-1 transition-[box-shadow,ring-color] duration-200 placeholder:text-charcoal/35 ${
    invalid
      ? "ring-danger focus:ring-2 focus:ring-danger"
      : "ring-charcoal/10 focus:ring-2 focus:ring-gold"
  }`;

const selectClass = (invalid: boolean) =>
  `${fieldClass(invalid)} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`;

const chipClass = (active: boolean) =>
  `rounded-full px-3.5 py-1.5 text-[0.8125rem] ring-1 transition-colors min-[400px]:px-4 min-[400px]:py-2 min-[400px]:text-sm duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
    active
      ? "bg-navy text-surface ring-navy"
      : "bg-white text-charcoal/75 ring-charcoal/10 hover:text-charcoal hover:ring-charcoal/25"
  }`;

const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3 text-sm font-medium text-surface shadow-[0_1px_2px_rgba(14,42,62,0.12)] transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)] hover:bg-charcoal hover:shadow-[0_8px_20px_-8px_rgba(14,42,62,0.45)] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const SECONDARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-medium text-charcoal transition-colors duration-300 hover:border-navy hover:bg-navy/[0.03] hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function newOpening(content: QuoteContent, colors: ColorSwatch[], id = makeId()): Opening {
  const product = content.products[0];
  return {
    id,
    product: product.id,
    style: product.styles[0],
    width: "",
    height: "",
    quantity: 1,
    glass: content.glass[0],
    color: colors[0]?.name ?? "",
  };
}

function emptyDraft(content: QuoteContent, colors: ColorSwatch[]): Draft {
  return {
    unit: content.units[0],
    // Fixed id keeps server and client markup identical on first render
    openings: [newOpening(content, colors, "opening-1")],
    details: {
      name: "",
      phone: "",
      location: "",
      projectType: content.projectTypes[0],
      timeline: content.timelines[0],
      siteVisit: true,
      notes: "",
    },
  };
}

/** Drafts can outlive edits to quote.json — snap stale option labels back to valid ones. */
function normalizeDraft(draft: Draft, content: QuoteContent, colors: ColorSwatch[]): Draft {
  const pick = (value: string, options: string[]) => (options.includes(value) ? value : options[0]);
  return {
    ...draft,
    unit: pick(draft.unit, content.units),
    openings: draft.openings.map((opening) => {
      const product = content.products.find((p) => p.id === opening.product) ?? content.products[0];
      return {
        ...opening,
        product: product.id,
        style: pick(opening.style, product.styles),
        glass: pick(opening.glass, content.glass),
        color: pick(opening.color, colors.map((color) => color.name)),
        quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.round(opening.quantity) || 1)),
      };
    }),
    details: {
      ...draft.details,
      location: draft.details.location && content.locations.includes(draft.details.location) ? draft.details.location : "",
      projectType: pick(draft.details.projectType, content.projectTypes),
      timeline: pick(draft.details.timeline, content.timelines),
    },
  };
}

/** `?product=windows&type=tilt-turn` from product pages → the matching first-step choice. */
function presetFromUrl(content: QuoteContent): Pick<Opening, "product" | "style"> | null {
  const params = new URLSearchParams(window.location.search);
  const product = content.products.find((p) => p.id === params.get("product"));
  if (!product) return null;
  const type = params.get("type");
  const style =
    Object.entries(product.previews ?? {}).find(([, opening]) => opening === type)?.[0] ??
    product.styles[0];
  return { product: product.id, style };
}

function isDraft(value: unknown): value is Draft {
  const draft = value as Draft;
  return Boolean(draft && Array.isArray(draft.openings) && draft.openings.length > 0 && draft.details);
}

function makeReference() {
  const now = new Date();
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const code = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HT-${date}-${code}`;
}

function isPositiveNumber(value: string) {
  const number = Number(value);
  return value.trim() !== "" && Number.isFinite(number) && number > 0;
}

function sizeLabel(opening: Opening, unit: string) {
  if (!opening.width && !opening.height) return "Size: measure on site";
  return `${opening.width || "?"} × ${opening.height || "?"} ${unit}`;
}

function productLabel(content: QuoteContent, id: QuoteProductId) {
  return content.products.find((product) => product.id === id)?.label ?? id;
}

function validateOpenings(draft: Draft): Errors {
  const errors: Errors = {};
  for (const opening of draft.openings) {
    for (const side of ["width", "height"] as const) {
      const value = opening[side];
      if (value && !isPositiveNumber(value)) {
        errors[`${opening.id}-${side}`] = "Use a number above 0, or leave blank.";
      }
    }
  }
  return errors;
}

function validateDetails(details: Details): Errors {
  const errors: Errors = {};
  const name = details.name.trim();
  if (!name) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Name needs at least 2 characters.";
  if (details.phone) {
    if (!/^\d{10}$/.test(details.phone)) errors.phone = "Enter a 10-digit mobile number, like 9841234567.";
    else if (!NEPAL_MOBILE.test(details.phone)) errors.phone = "Nepal mobile numbers start with 96, 97, or 98.";
  }
  if (!details.location) errors.location = "Choose where the site is.";
  return errors;
}

function buildMessage(content: QuoteContent, draft: Draft, reference: string) {
  const { details } = draft;
  const lines = [content.whatsappIntro, `Ref: ${reference}`, "", "Openings:"];
  draft.openings.forEach((opening, index) => {
    const parts = [
      `${productLabel(content, opening.product)} — ${opening.style}`,
      sizeLabel(opening, draft.unit),
      `Qty ${opening.quantity}`,
      opening.product !== "panels" ? `Glass: ${opening.glass}` : null,
      opening.color,
    ].filter(Boolean);
    lines.push(`${index + 1}. ${parts.join(" · ")}`);
  });
  lines.push(
    "",
    `Name: ${details.name.trim()}`,
    ...(details.phone ? [`Phone: ${details.phone}`] : []),
    `Location: ${details.location}`,
    `Project: ${details.projectType}`,
    `Timeline: ${details.timeline}`,
    `Free site measurement: ${details.siteVisit ? "Yes, please" : "Not needed"}`
  );
  if (details.notes.trim()) lines.push(`Notes: ${details.notes.trim()}`);
  return lines.join("\n");
}

export function QuoteBuilder({ content, colors, whatsapp }: QuoteBuilderProps) {
  const formId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(content, colors));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [reference, setReference] = useState("");
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  // Only the opening being edited gets a WebGL canvas
  const [activeId, setActiveId] = useState<string | null>(null);
  const presetRef = useRef<Pick<Opening, "product" | "style"> | null | undefined>(undefined);

  useEffect(() => {
    let next = emptyDraft(content, colors);
    let wasRestored = false;
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
      if (isDraft(saved) && JSON.stringify(saved) !== JSON.stringify(next)) {
        next = normalizeDraft(saved, content, colors);
        wasRestored = true;
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    // Read once per mount: the URL is cleaned below, and a re-run must still see it.
    if (presetRef.current === undefined) presetRef.current = presetFromUrl(content);
    const preset = presetRef.current;
    if (preset) {
      const match = next.openings.find((o) => o.product === preset.product && o.style === preset.style);
      if (match) {
        setActiveId(match.id);
      } else if (!wasRestored) {
        next = { ...next, openings: [{ ...next.openings[0], ...preset }] };
      } else {
        const opening = { ...newOpening(content, colors), ...preset };
        next = { ...next, openings: [...next.openings, opening] };
        setActiveId(opening.id);
      }
      // One-shot: a refresh or Back should not add the same opening again.
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }

    setDraft(next);
    setRestored(wasRestored);
    setHydrated(true);
  }, [content, colors]);

  useEffect(() => {
    if (!hydrated) return;
    const serialized = JSON.stringify(draft);
    if (serialized === JSON.stringify(emptyDraft(content, colors))) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    }
  }, [draft, hydrated, content, colors]);

  const productsById = Object.fromEntries(content.products.map((p) => [p.id, p]));
  const currentActiveId = draft.openings.some((o) => o.id === activeId) ? activeId : draft.openings[0]?.id;
  const finishSlugByName = Object.fromEntries(colors.map((color) => [color.name, color.slug]));
  const totalUnits = draft.openings.reduce((sum, opening) => sum + opening.quantity, 0);

  function updateOpening(id: string, patch: Partial<Opening>) {
    setDraft((current) => ({
      ...current,
      openings: current.openings.map((opening) => (opening.id === id ? { ...opening, ...patch } : opening)),
    }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[`${id}-${key}`];
      return next;
    });
  }

  function updateDetails(patch: Partial<Details>) {
    setDraft((current) => ({ ...current, details: { ...current.details, ...patch } }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }

  function addOpening() {
    const opening = newOpening(content, colors);
    setDraft((current) => ({ ...current, openings: [...current.openings, opening] }));
    setActiveId(opening.id);
  }

  function removeOpening(id: string) {
    setDraft((current) => ({ ...current, openings: current.openings.filter((o) => o.id !== id) }));
  }

  function goTo(next: number) {
    setStep(next);
    setCopied(false);
    requestAnimationFrame(() => {
      const top = (cardRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 96;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    });
  }

  function focusFirstError(found: Errors) {
    const first = Object.keys(found)[0];
    requestAnimationFrame(() => document.getElementById(`${formId}-${first}`)?.focus());
  }

  function next() {
    const found = step === 0 ? validateOpenings(draft) : validateDetails(draft.details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }
    if (step === 1) setReference(makeReference());
    goTo(step + 1);
  }

  function startOver() {
    window.localStorage.removeItem(STORAGE_KEY);
    setDraft(emptyDraft(content, colors));
    setErrors({});
    setRestored(false);
    setReference("");
    goTo(0);
  }

  const message = reference ? buildMessage(content, draft, reference) : "";

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const errorText = (key: string) =>
    errors[key] ? (
      <span id={`${formId}-${key}-error`} className="mt-1.5 block text-sm font-normal text-danger">
        {errors[key]}
      </span>
    ) : null;

  const describedBy = (key: string) => (errors[key] ? `${formId}-${key}-error` : undefined);

  return (
    <div
      ref={cardRef}
      className="min-w-0 rounded-3xl bg-white ring-1 ring-charcoal/5 shadow-[0_24px_60px_-32px_rgba(27,27,29,0.28)] sm:rounded-[2rem]"
    >
      <div data-print-hide className="border-b border-charcoal/[0.06] px-4 py-4 min-[400px]:px-5 sm:px-8 sm:py-6 lg:px-10">
        <ol className="flex items-center gap-2 sm:gap-3" aria-label="Quote steps">
          {content.steps.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={index >= step}
                  onClick={() => goTo(index)}
                  aria-current={current ? "step" : undefined}
                  className="flex min-w-0 items-center gap-2.5 rounded-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-default"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-300 ${
                      current
                        ? "bg-navy text-surface"
                        : done
                          ? "bg-gold text-charcoal"
                          : "bg-charcoal/[0.06] text-charcoal/45"
                    }`}
                  >
                    {done ? (
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
                        <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={`hidden truncate text-sm sm:block ${current ? "font-medium text-charcoal" : "text-charcoal/50"}`}
                  >
                    {label}
                  </span>
                </button>
                {index < content.steps.length - 1 && (
                  <span aria-hidden className="h-px flex-1 bg-charcoal/10">
                    <span
                      className="block h-px bg-gold transition-[width] duration-500 ease-[var(--ease-premium)]"
                      style={{ width: done ? "100%" : "0%" }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-charcoal/50 sm:hidden">
          Step {step + 1} of {content.steps.length} · {content.steps[step]}
        </p>
      </div>

      <div className="px-4 py-6 min-[400px]:px-5 sm:px-8 sm:py-9 lg:px-10">
        {restored && step === 0 && (
          <div data-print-hide className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream/60 px-4 py-3 text-sm text-charcoal/70 ring-1 ring-gold/20">
            <span>We restored your saved draft on this device.</span>
            <button type="button" onClick={startOver} className="font-medium text-navy hover:text-gold">
              Start fresh
            </button>
          </div>
        )}

        {step === 0 && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] tracking-tight text-charcoal">
                  What do you need?
                </h2>
                <p className="mt-2 max-w-md text-sm text-charcoal/55">
                  Add each opening. Not sure of sizes? Leave them blank — we measure on site.
                </p>
              </div>
              <div role="radiogroup" aria-label="Size unit" className="inline-flex rounded-full bg-surface p-1 ring-1 ring-charcoal/[0.08]">
                {content.units.map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    role="radio"
                    aria-checked={draft.unit === unit}
                    onClick={() => setDraft((current) => ({ ...current, unit }))}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                      draft.unit === unit ? "bg-white text-charcoal shadow-sm ring-1 ring-charcoal/[0.06]" : "text-charcoal/50 hover:text-charcoal"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <ol className="mt-7 space-y-4">
              {draft.openings.map((opening, index) => {
                const product = productsById[opening.product];
                const active = opening.id === currentActiveId;
                return (
                  <li
                    key={opening.id}
                    onPointerDownCapture={() => setActiveId(opening.id)}
                    onFocusCapture={() => setActiveId(opening.id)}
                    className={`rounded-2xl p-3.5 ring-1 transition-[background-color,box-shadow] duration-300 min-[400px]:p-4 sm:p-6 ${
                      active ? "bg-surface/70 ring-gold/30" : "bg-surface/40 ring-charcoal/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-gold">
                        Opening {String(index + 1).padStart(2, "0")}
                      </p>
                      {draft.openings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOpening(opening.id)}
                          className="text-sm text-charcoal/45 transition-colors hover:text-danger"
                          aria-label={`Remove opening ${index + 1}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div role="radiogroup" aria-label="Product" className="mt-4 grid grid-cols-3 gap-1.5 min-[400px]:gap-2 sm:gap-3">
                      {content.products.map((option) => {
                        const active = option.id === opening.product;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() =>
                              updateOpening(opening.id, { product: option.id, style: option.styles[0] })
                            }
                            className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl px-1 py-3 text-[0.8125rem] ring-1 transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold min-[400px]:text-sm sm:flex-row sm:justify-center sm:gap-2 sm:rounded-2xl ${
                              active
                                ? "bg-white font-medium text-navy shadow-[0_6px_16px_-10px_rgba(14,42,62,0.35)] ring-navy/40"
                                : "bg-white/60 text-charcoal/60 ring-charcoal/[0.08] hover:bg-white hover:text-charcoal"
                            }`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={active ? "text-gold" : ""}
                              aria-hidden
                            >
                              <path d={PRODUCT_ICONS[option.id]} />
                            </svg>
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <fieldset className="mt-5">
                      <legend className="text-sm font-medium text-charcoal">Style</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.styles.map((style: string) => (
                          <button
                            key={style}
                            type="button"
                            aria-pressed={opening.style === style}
                            onClick={() => updateOpening(opening.id, { style })}
                            className={chipClass(opening.style === style)}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-5">
                      {active ? (
                        <QuotePreview
                          category={opening.product}
                          openingType={product.previews?.[opening.style]}
                          finishSlug={finishSlugByName[opening.color] ?? "white"}
                          glazingSlug={content.glassPreviews[opening.glass] ?? "clear"}
                          title={`${opening.style} ${product.label.toLowerCase().replace(/s$/, "")}`}
                          detail={opening.product === "panels" ? "Woodgrain" : opening.color}
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveId(opening.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/70 py-3 text-sm font-medium text-navy ring-1 ring-charcoal/[0.08] transition-colors duration-300 hover:bg-white hover:ring-gold/40"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gold" aria-hidden>
                            <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5" />
                          </svg>
                          Show 3D preview
                        </button>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:grid-cols-[1fr_1fr_auto] sm:gap-4">
                      {(["width", "height"] as const).map((side) => (
                        <label key={side} className="block min-w-0 text-sm font-medium text-charcoal">
                          {side === "width" ? "Width" : "Height"}{" "}
                          <span className="font-normal text-charcoal/40">({draft.unit})</span>
                          <input
                            id={`${formId}-${opening.id}-${side}`}
                            inputMode="decimal"
                            value={opening[side]}
                            onChange={(event) =>
                              updateOpening(opening.id, { [side]: event.target.value.replace(/[^\d.]/g, "").slice(0, 7) })
                            }
                            aria-invalid={Boolean(errors[`${opening.id}-${side}`])}
                            aria-describedby={describedBy(`${opening.id}-${side}`)}
                            className={`${fieldClass(Boolean(errors[`${opening.id}-${side}`]))} bg-white`}
                            placeholder="Optional"
                          />
                          {errorText(`${opening.id}-${side}`)}
                        </label>
                      ))}
                      <div className="min-[360px]:col-span-2 sm:col-span-1">
                        <span className="block text-sm font-medium text-charcoal">Quantity</span>
                        <div className="mt-2 flex h-[3.125rem] w-full items-center justify-between rounded-2xl bg-white ring-1 ring-charcoal/10 sm:inline-flex sm:w-auto">
                          <button
                            type="button"
                            onClick={() => updateOpening(opening.id, { quantity: Math.max(1, opening.quantity - 1) })}
                            disabled={opening.quantity <= 1}
                            className="flex h-full w-11 items-center justify-center text-lg text-charcoal/60 transition-colors hover:text-navy disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <output className="w-8 text-center text-base tabular-nums text-charcoal" aria-live="polite">
                            {opening.quantity}
                          </output>
                          <button
                            type="button"
                            onClick={() =>
                              updateOpening(opening.id, { quantity: Math.min(MAX_QUANTITY, opening.quantity + 1) })
                            }
                            disabled={opening.quantity >= MAX_QUANTITY}
                            className="flex h-full w-11 items-center justify-center text-lg text-charcoal/60 transition-colors hover:text-navy disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-5 grid gap-4 ${opening.product !== "panels" ? "sm:grid-cols-2" : ""}`}>
                      {opening.product !== "panels" && (
                        <label className="block text-sm font-medium text-charcoal">
                          Glass
                          <select
                            value={opening.glass}
                            onChange={(event) => updateOpening(opening.id, { glass: event.target.value })}
                            className={`${selectClass(false)} bg-white`}
                            style={SELECT_CHEVRON}
                          >
                            {content.glass.map((glass) => (
                              <option key={glass}>{glass}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      <fieldset>
                        <legend className="text-sm font-medium text-charcoal">
                          Frame colour <span className="font-normal text-charcoal/45">· {opening.color}</span>
                        </legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {colors.map((color) => {
                            const active = opening.color === color.name;
                            return (
                              <button
                                key={color.slug}
                                type="button"
                                aria-pressed={active}
                                aria-label={color.name}
                                title={color.name}
                                onClick={() => updateOpening(opening.id, { color: color.name })}
                                className={`h-8 w-8 rounded-full ring-offset-2 min-[400px]:h-9 min-[400px]:w-9 ring-offset-surface transition-[box-shadow] duration-200 focus-visible:outline-none ${
                                  active ? "ring-2 ring-gold" : "ring-1 ring-charcoal/15 hover:ring-charcoal/40"
                                }`}
                                style={{ backgroundColor: color.hex }}
                              />
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={addOpening}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-navy/25 px-4 py-4 text-sm font-medium text-navy transition-colors duration-300 hover:border-navy hover:bg-navy/[0.03]"
            >
              <span aria-hidden className="text-lg leading-none text-gold">+</span>
              Add another opening
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] tracking-tight text-charcoal">
              About your project
            </h2>
            <p className="mt-2 max-w-md text-sm text-charcoal/55">
              So we know who to reply to and where the site is.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-charcoal">
                Name
                <input
                  id={`${formId}-name`}
                  autoComplete="name"
                  value={draft.details.name}
                  onChange={(event) => updateDetails({ name: event.target.value })}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={fieldClass(Boolean(errors.name))}
                  placeholder="Your full name"
                />
                {errorText("name")}
              </label>

              <label className="block text-sm font-medium text-charcoal">
                Phone <span className="font-normal text-charcoal/45">(optional)</span>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={draft.details.phone}
                  onChange={(event) => updateDetails({ phone: event.target.value.replace(/\D/g, "").slice(0, 10) })}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("phone")}
                  className={fieldClass(Boolean(errors.phone))}
                  placeholder="98XXXXXXXX"
                />
                {errorText("phone")}
              </label>

              <label className="block text-sm font-medium text-charcoal sm:col-span-2">
                Site location
                <select
                  id={`${formId}-location`}
                  value={draft.details.location}
                  onChange={(event) => updateDetails({ location: event.target.value })}
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={describedBy("location")}
                  className={selectClass(Boolean(errors.location))}
                  style={SELECT_CHEVRON}
                >
                  <option value="">Choose an area</option>
                  {content.locations.map((location) => (
                    <option key={location}>{location}</option>
                  ))}
                </select>
                {errorText("location")}
              </label>

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium text-charcoal">Project type</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={draft.details.projectType === type}
                      onClick={() => updateDetails({ projectType: type })}
                      className={chipClass(draft.details.projectType === type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-medium text-charcoal">Timeline</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.timelines.map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      aria-pressed={draft.details.timeline === timeline}
                      onClick={() => updateDetails({ timeline })}
                      className={chipClass(draft.details.timeline === timeline)}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream/50 p-4 ring-1 ring-gold/20 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.details.siteVisit}
                  onChange={(event) => updateDetails({ siteVisit: event.target.checked })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-navy)]"
                />
                <span>
                  <span className="block text-sm font-medium text-charcoal">Book a free site measurement</span>
                  <span className="mt-0.5 block text-sm text-charcoal/55">
                    Available across the Kathmandu valley — we confirm a time on WhatsApp.
                  </span>
                </span>
              </label>

              <label className="block text-sm font-medium text-charcoal sm:col-span-2">
                Notes <span className="font-normal text-charcoal/45">(optional)</span>
                <textarea
                  rows={4}
                  maxLength={600}
                  value={draft.details.notes}
                  onChange={(event) => updateDetails({ notes: event.target.value })}
                  className={`${fieldClass(false)} min-h-[7rem] resize-y`}
                  placeholder="Floor, access, mosquito nets, grills, or anything else we should know…"
                />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div id="quote-summary">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] tracking-tight text-charcoal">
                    Your quote request
                  </h2>
                  <p className="mt-2 text-sm text-charcoal/55">
                    {draft.openings.length} {draft.openings.length === 1 ? "opening" : "openings"} · {totalUnits}{" "}
                    {totalUnits === 1 ? "unit" : "units"} in total
                  </p>
                </div>
                <p className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-wide text-charcoal/70 ring-1 ring-gold/25">
                  {reference}
                </p>
              </div>

              <ol className="mt-6 divide-y divide-charcoal/[0.06] rounded-2xl bg-surface/50 ring-1 ring-charcoal/[0.06]">
                {draft.openings.map((opening, index) => (
                  <li key={opening.id} className="flex items-start gap-3 px-3.5 py-3.5 min-[400px]:gap-4 min-[400px]:px-4 min-[400px]:py-4 sm:px-5">
                    <span className="mt-0.5 font-display text-sm text-gold">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-charcoal">
                        {productLabel(content, opening.product)} — {opening.style}
                      </p>
                      <p className="mt-1 text-sm text-charcoal/55">
                        {[sizeLabel(opening, draft.unit), opening.product !== "panels" ? `Glass: ${opening.glass}` : null, opening.color]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium tabular-nums text-charcoal/70 ring-1 ring-charcoal/[0.08]">
                      × {opening.quantity}
                    </span>
                  </li>
                ))}
              </ol>

              <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                {[
                  ["Name", draft.details.name.trim()],
                  ["Phone", draft.details.phone || "—"],
                  ["Location", draft.details.location],
                  ["Project", draft.details.projectType],
                  ["Timeline", draft.details.timeline],
                  ["Site measurement", draft.details.siteVisit ? "Yes, please" : "Not needed"],
                ].map(([term, value]) => (
                  <div key={term} className="flex flex-col gap-0.5 border-b border-charcoal/[0.06] pb-3">
                    <dt className="text-xs uppercase tracking-[0.14em] text-charcoal/40">{term}</dt>
                    <dd className="text-charcoal/85">{value}</dd>
                  </div>
                ))}
                {draft.details.notes.trim() && (
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <dt className="text-xs uppercase tracking-[0.14em] text-charcoal/40">Notes</dt>
                    <dd className="whitespace-pre-line text-charcoal/85">{draft.details.notes.trim()}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div data-print-hide className="mt-8 rounded-2xl bg-navy p-4 text-surface min-[400px]:p-5 sm:p-6">
              <p className="font-display text-xl tracking-tight">Ready to send?</p>
              <p className="mt-1 text-sm text-surface/65">
                WhatsApp opens with your list already written — just press send.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={whatsappHref(whatsapp, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-[background-color,box-shadow] duration-300 hover:bg-[#1ebe5d] hover:shadow-[0_8px_20px_-8px_rgba(18,43,24,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <WhatsAppIcon size={18} />
                  Send on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-surface/85 ring-1 ring-surface/20 transition-colors duration-300 hover:bg-surface/[0.08] hover:text-surface"
                >
                  Print / save PDF
                </button>
                <button
                  type="button"
                  onClick={copySummary}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-surface/85 ring-1 ring-surface/20 transition-colors duration-300 hover:bg-surface/[0.08] hover:text-surface"
                  aria-live="polite"
                >
                  {copied ? "Copied ✓" : "Copy summary"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          data-print-hide
          className="mt-8 flex flex-col-reverse gap-3 border-t border-charcoal/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className={SECONDARY_BUTTON}>
              ← Back
            </button>
          ) : (
            <p className="text-sm text-charcoal/45">Saved on this device as you go.</p>
          )}
          {step < 2 ? (
            <button type="button" onClick={next} className={PRIMARY_BUTTON}>
              {step === 0 ? "Continue to details" : "Review quote"} <span aria-hidden>→</span>
            </button>
          ) : (
            <button type="button" onClick={startOver} className="text-sm font-medium text-charcoal/50 transition-colors hover:text-danger">
              Start a new quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
