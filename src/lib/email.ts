import "server-only";

import { Resend } from "resend";
import { z } from "zod";

/* ────────────────────────────────────────────────────────────────────────────
   Resend client + contact-form payload schema.
   Server-side only — the API key never crosses the wire.
   ──────────────────────────────────────────────────────────────────────────── */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name (at least 2 characters).").max(80),
  email: z.string().trim().email("That doesn't look like a valid email address.").max(160),
  subject: z
    .string()
    .trim()
    .max(120, "Subject is a little long — keep it under 120 characters.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "A few more words please — at least 10 characters.")
    .max(4000, "That's a lot of message — please trim under 4000 characters."),
  /** Honeypot — must be empty. Bots happily fill in any visible field. */
  website: z.string().max(0, "spam").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
const TO = process.env.CONTACT_TO_EMAIL ?? "hello@ipeleng.dev";

let cachedClient: Resend | null = null;
function getClient(): Resend | null {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  cachedClient = new Resend(apiKey);
  return cachedClient;
}

/**
 * Send a contact-form submission via Resend.
 *
 * Returns a discriminated union so the caller can react to misconfiguration
 * (no API key) and delivery failures separately.
 */
export async function sendContactEmail(
  input: ContactInput,
): Promise<
  | { ok: true; id: string | null }
  | { ok: false; reason: "no-api-key" | "send-failed"; message: string }
> {
  const client = getClient();
  if (!client) {
    return {
      ok: false,
      reason: "no-api-key",
      message:
        "RESEND_API_KEY isn't set. Add it to .env.local (and to Vercel env vars for production).",
    };
  }

  const subject = input.subject?.trim()
    ? `[Portfolio] ${input.subject.trim()}`
    : `[Portfolio] New message from ${input.name}`;

  const text = [
    `From:    ${input.name} <${input.email}>`,
    input.subject?.trim() ? `Subject: ${input.subject.trim()}` : null,
    "",
    input.message,
    "",
    "—",
    "Sent via the contact form on ipelengmekgwe.vercel.app",
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const { data, error } = await client.emails.send({
      from: FROM,
      to: [TO],
      replyTo: input.email,
      subject,
      text,
    });
    if (error) {
      return {
        ok: false,
        reason: "send-failed",
        message: error.message ?? "Resend returned an error.",
      };
    }
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    return {
      ok: false,
      reason: "send-failed",
      message: err instanceof Error ? err.message : "Unknown error sending email.",
    };
  }
}
