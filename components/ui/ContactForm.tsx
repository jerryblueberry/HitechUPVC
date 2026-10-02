"use client";

import { useId, useState, type FormEvent } from "react";

const INTERESTS = ["Windows", "Doors", "Panels", "A site visit", "Something else"] as const;

type Field = "name" | "email" | "phone" | "interest" | "message";

interface Values {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

const empty: Values = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NEPAL_MOBILE = /^9[678]\d{8}$/;

function phoneError(phone: string): string | undefined {
  if (!phone) return undefined;
  if (!/^\d{10}$/.test(phone)) return "Enter a 10-digit mobile number, like 9841234567.";
  if (!NEPAL_MOBILE.test(phone)) return "Nepal mobile numbers start with 96, 97, or 98.";
  return undefined;
}

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length < 2) errors.name = "Name needs at least 2 characters.";

  if (!email) errors.email = "Enter your email.";
  else if (!EMAIL.test(email)) errors.email = "Use a valid email, like name@company.com.";

  const phoneMessage = phoneError(phone);
  if (phoneMessage) errors.phone = phoneMessage;

  if (!values.interest) errors.interest = "Choose what this is about.";

  if (!message) errors.message = "Write a short message.";
  else if (message.length < 12) errors.message = "Give us a little more — at least 12 characters.";

  return errors;
}

const fieldClass = (invalid: boolean) =>
  `mt-2 w-full min-w-0 rounded-2xl bg-surface px-4 py-3 text-base text-charcoal outline-none ring-1 transition-[box-shadow,ring-color] duration-200 placeholder:text-charcoal/35 ${
    invalid
      ? "ring-danger focus:ring-2 focus:ring-danger"
      : "ring-charcoal/10 focus:ring-2 focus:ring-gold"
  }`;

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState<Values>(empty);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors = validate(values);
  const show = (field: Field) => Boolean((touched[field] || submitted) && errors[field]);

  function set<K extends Field>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const next = validate(values);
    if (Object.keys(next).length > 0) {
      const order: Field[] = ["name", "email", "phone", "interest", "message"];
      const first = order.find((field) => next[field]);
      requestAnimationFrame(() => {
        document.getElementById(`${formId}-${first}`)?.focus();
      });
      return;
    }

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSending(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div
        className="flex h-full min-h-[22rem] flex-col justify-center rounded-3xl bg-white px-5 py-8 ring-1 ring-charcoal/5 shadow-[0_24px_60px_-32px_rgba(27,27,29,0.28)] sm:min-h-[28rem] sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10"
        role="status"
        aria-live="polite"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/12 text-success">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 12.5 10 17.5 19 7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-6 font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.1] tracking-tight text-charcoal">
          Message received.
        </h2>
        <p className="mt-3 max-w-md text-charcoal/60">
          Thank you. We’ll reply by email or WhatsApp. Nothing was sent to a
          server — this is a working preview of the form.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-medium text-surface transition-colors hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          onClick={() => {
            setValues(empty);
            setTouched({});
            setSubmitted(false);
            setSuccess(false);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="min-w-0 rounded-3xl bg-white px-5 py-7 ring-1 ring-charcoal/5 shadow-[0_24px_60px_-32px_rgba(27,27,29,0.28)] sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10"
    >
      <p className="eyebrow mb-4 text-gold">Send a message</p>
      <h2 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.1] tracking-tight text-charcoal">
        Tell us what you need.
      </h2>
      <p className="mt-3 max-w-md text-charcoal/60">
        Windows, doors, or panels — a short note is enough. We’ll come back to you.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal">
          Name
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={show("name")}
            aria-describedby={show("name") ? `${formId}-name-error` : undefined}
            className={fieldClass(show("name"))}
            placeholder="Your full name"
          />
          {show("name") && (
            <span id={`${formId}-name-error`} className="mt-1.5 block text-sm text-danger">
              {errors.name}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-charcoal">
          Email
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={show("email")}
            aria-describedby={show("email") ? `${formId}-email-error` : undefined}
            className={fieldClass(show("email"))}
            placeholder="name@company.com"
          />
          {show("email") && (
            <span id={`${formId}-email-error`} className="mt-1.5 block text-sm text-danger">
              {errors.email}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-charcoal">
          Phone <span className="font-normal text-charcoal/45">(optional)</span>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            minLength={10}
            maxLength={10}
            value={values.phone}
            onChange={(event) => set("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            aria-invalid={show("phone")}
            aria-describedby={show("phone") ? `${formId}-phone-error` : `${formId}-phone-hint`}
            className={fieldClass(show("phone"))}
            placeholder="98XXXXXXXX"
          />
          {show("phone") ? (
            <span id={`${formId}-phone-error`} className="mt-1.5 block text-sm text-danger">
              {errors.phone}
            </span>
          ) : (
            <span id={`${formId}-phone-hint`} className="mt-1.5 block text-xs font-normal text-charcoal/45">
              10-digit Nepal mobile number
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-charcoal">
          I’m interested in
          <select
            id={`${formId}-interest`}
            name="interest"
            value={values.interest}
            onChange={(event) => set("interest", event.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, interest: true }))}
            aria-invalid={show("interest")}
            aria-describedby={show("interest") ? `${formId}-interest-error` : undefined}
            className={`${fieldClass(show("interest"))} appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'><path d='M1 1.5 6 6.5 11 1.5' stroke='%231B1B1D' stroke-width='1.5' stroke-linecap='round'/></svg>\")",
            }}
          >
            <option value="">Choose one</option>
            {INTERESTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {show("interest") && (
            <span id={`${formId}-interest-error`} className="mt-1.5 block text-sm text-danger">
              {errors.interest}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Message
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={5}
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            aria-invalid={show("message")}
            aria-describedby={show("message") ? `${formId}-message-error` : undefined}
            className={`${fieldClass(show("message"))} min-h-[8.5rem] resize-y`}
            placeholder="Sizes, finish, or the site you want to visit…"
          />
          {show("message") && (
            <span id={`${formId}-message-error`} className="mt-1.5 block text-sm text-danger">
              {errors.message}
            </span>
          )}
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center rounded-full bg-navy px-7 py-3 text-sm font-medium text-surface transition-colors hover:bg-charcoal disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto"
        >
          {sending ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-charcoal/45">No spam. We only use this to reply.</p>
      </div>
    </form>
  );
}
