import { expect, test } from "@playwright/test";

test("should navigate to the about page w/ mobile", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("/");
  // Find an element with the text 'About' and click on it
  await page.getByTestId('play-button-main').click()
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL("/download");
  // The new page should contain an h1 with "About"
  await expect(page.locator("h1")).toContainText("Как начать играть?");
});

test("should contain play button and it is visible right away w/ mobile", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("play-button-main")).toBeVisible();
  await expect(page.getByTestId("play-button-main")).toBeInViewport();
});
