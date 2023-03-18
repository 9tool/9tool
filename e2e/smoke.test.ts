import { expect, test, type Page } from "@playwright/test";

test("write a post", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("9tool")).toBeVisible();

  await expect(page.getByText("Logged in as")).toBeVisible();
  await expect(page.getByText("testuser")).toBeVisible();
});
