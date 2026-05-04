import { describe, expect, it } from "vitest";

import { contactSchema } from "./email";

describe("contactSchema", () => {
  const valid = {
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Hello",
    message: "I would love to chat about a role.",
    website: "",
  };

  it("accepts a complete valid payload", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("treats subject as optional", () => {
    const r = contactSchema.safeParse({ ...valid, subject: "" });
    expect(r.success).toBe(true);
  });

  it("rejects too-short names", () => {
    const r = contactSchema.safeParse({ ...valid, name: "A" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid emails", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects too-short messages", () => {
    const r = contactSchema.safeParse({ ...valid, message: "hi" });
    expect(r.success).toBe(false);
  });

  it("rejects messages longer than 4000 chars", () => {
    const r = contactSchema.safeParse({ ...valid, message: "a".repeat(4001) });
    expect(r.success).toBe(false);
  });

  it("rejects non-empty honeypot (spam)", () => {
    const r = contactSchema.safeParse({ ...valid, website: "https://spammer.example" });
    expect(r.success).toBe(false);
  });
});
