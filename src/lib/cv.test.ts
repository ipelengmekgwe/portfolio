import { describe, expect, it } from "vitest";
import { cv, formatRange } from "./cv";

describe("formatRange", () => {
  it("formats a closed range", () => {
    expect(formatRange("2021-03", "2024-01")).toBe("Mar 2021 – Jan 2024");
  });

  it("renders 'Present' when end is null", () => {
    expect(formatRange("2025-12", null)).toBe("Dec 2025 – Present");
  });

  it("falls back to year-only when month is missing", () => {
    expect(formatRange("2010", "2010")).toBe("2010 – 2010");
  });
});

describe("cv data integrity", () => {
  it("includes the new Richfield BSc IT 2026 – 2028 entry at the top of education", () => {
    const first = cv.education[0];
    expect(first?.institution).toBe("Richfield");
    expect(first?.credential).toContain("BSc Information Technology");
    expect(first?.year).toBe("2026 – 2028");
    expect(first?.status).toBe("in-progress");
  });

  it("has TypeScript listed under Languages & Frameworks", () => {
    const langs = cv.skills["Languages & Frameworks"];
    expect(langs).toContain("TypeScript");
  });

  it("includes Engineering Leadership skills bucket", () => {
    expect(cv.skills["Engineering Leadership"]).toBeDefined();
    expect(cv.skills["Engineering Leadership"]?.length).toBeGreaterThan(0);
  });

  it("fixes 'PostgerSQL' typo to 'PostgreSQL'", () => {
    const data = cv.skills["Database & Data"] ?? [];
    expect(data).toContain("PostgreSQL");
    expect(data).not.toContain("PostgerSQL");
  });

  it("orders experience newest first", () => {
    const starts = cv.experience.map((e) => e.start);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });
});
