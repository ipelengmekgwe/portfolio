"use client";

import { CheckCircle2, Send, XCircle } from "lucide-react";
import { useActionState } from "react";

import { type ContactState, submitContact } from "@/app/actions/contact";
import { cn } from "@/lib/cn";

const initialState: ContactState = { status: "idle" };

/**
 * Contact form for the Epilogue. Progressively enhanced via React 19's
 * useActionState — works without JS, lights up with inline validation and
 * a sealed-letter success state when JS is available.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <output
        aria-live="polite"
        className="block paper-page p-8 text-center bg-paper-shadow/30 border border-gold/30"
      >
        <CheckCircle2 aria-hidden="true" className="mx-auto size-10 text-rust mb-4" />
        <p className="font-display text-2xl text-ink mb-2">Sent.</p>
        <p className="text-ink-soft">{state.message}</p>
      </output>
    );
  }

  const fieldErr = (
    key: keyof NonNullable<Extract<ContactState, { status: "error" }>["fieldErrors"]>,
  ) => (state.status === "error" ? state.fieldErrors?.[key] : undefined);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — visually hidden; bots fill it, humans don't. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
        error={fieldErr("name")}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fieldErr("email")}
      />

      <Field label="Subject (optional)" name="subject" type="text" error={fieldErr("subject")} />

      <Field
        label="Message"
        name="message"
        as="textarea"
        rows={5}
        required
        error={fieldErr("message")}
      />

      {state.status === "error" && !state.fieldErrors ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-rust">
          <XCircle aria-hidden="true" className="size-4 mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-2 px-6 py-3 rounded-page",
          "bg-rust text-paper font-display text-lg",
          "transition-all hover:-translate-y-0.5 hover:shadow-page",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        )}
      >
        <Send aria-hidden="true" className="size-4" />
        {isPending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  error?: string;
};

function Field({
  label,
  name,
  type = "text",
  as = "input",
  rows = 4,
  required,
  autoComplete,
  error,
}: FieldProps) {
  const id = `field-${name}`;
  const baseInput = cn(
    "block w-full rounded-page px-3 py-2 bg-paper border transition-colors",
    "font-body text-base text-ink",
    "focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold",
    error ? "border-rust" : "border-ink-faint/30",
  );

  return (
    <div>
      <label htmlFor={id} className="block font-mono text-xs small-caps text-ink-faint mb-2">
        {label}
        {required ? <span className="ml-1 text-rust">*</span> : null}
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(baseInput, "resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={baseInput}
        />
      )}

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rust flex items-start gap-1.5">
          <XCircle aria-hidden="true" className="size-3.5 mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
