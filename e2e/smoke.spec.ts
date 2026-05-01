import { expect, test } from "@playwright/test";

test("home page renders the cover and title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ipeleng Mekgwe", level: 1 })).toBeVisible();
  await expect(page.getByText("A portfolio in five chapters")).toBeVisible();
});

test("home page has correct title and description metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ipeleng Mekgwe/);
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toContain("portfolio");
});
