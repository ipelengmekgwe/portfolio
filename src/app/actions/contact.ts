"use server";

import { contactSchema, sendContactEmail } from "@/lib/email";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<string, string>> };

/**
 * Server action that backs the contact form. Validates the FormData with the
 * shared Zod schema, then hands off to Resend. Always returns a friendly
 * `ContactState` so the form can render a status without throwing.
 *
 * Usable with React 19's `useActionState` (signature: `(prev, formData) => state`).
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  // Honeypot: if any bot filled in the hidden "website" field, silently
  // pretend success so they don't retry, but skip the actual send.
  if (parsed.data.website) {
    return {
      status: "success",
      message: "Thanks — your message has been sent.",
    };
  }

  const result = await sendContactEmail(parsed.data);
  if (!result.ok) {
    if (result.reason === "no-api-key") {
      return {
        status: "error",
        message:
          "The contact form isn't fully configured yet. Email me directly at hello@ipeleng.dev instead.",
      };
    }
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please try again, or email me directly at hello@ipeleng.dev.",
    };
  }

  return {
    status: "success",
    message: "Thanks — your message has been sent. I'll be in touch soon.",
  };
}
