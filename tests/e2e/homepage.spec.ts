import { test, expect } from "@playwright/test";

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/localhost:8080\/?$/);
  await expect(page).toHaveTitle(/Zeus/i);
  await expect(page.getByRole("link", { name: /Zeus/i }).first()).toBeVisible();
});
