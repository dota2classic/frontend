import { expect, test } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    {
      name: "dota2classic_auth_token",
      value: process.env.PLAYWRIGHT_NEWBIE_USER,
      domain: "127.0.0.1",
      path: "/",
      expires: -1,
    },
  ]);
  console.log(await context.cookies());
});

test("should render profile page for complete newbie", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("/");
  // We have our profile in navbar
  await expect(page.getByTestId("navbar-user")).toBeVisible({ timeout: 1000 });

  await page.goto(`/players/${process.env.PLAYWRIGHT_NEWBIE_USER_ID}`);
  await expect(page.getByTestId("player-matches-header")).toBeVisible();
  await expect(
    page.getByTestId("player-hero-performance-header"),
  ).toBeVisible();

  await expect(page.getByTestId("player-teammates-header")).toBeVisible();
  await expect(page.getByTestId("player-summary-panel")).toBeVisible();
  await expect(page.getByTestId("player-summary-player-name")).toHaveText(
    process.env.PLAYWRIGHT_NEWBIE_USER_NAME,
  );
  await expect(page.getByTestId("player-summary-last-game")).not.toBeAttached();

  await expect(page.getByTestId('player-summary-win-loss')).toBeVisible()
  await expect(page.getByTestId('player-summary-winrate')).toBeVisible()
  await expect(page.getByTestId('player-summary-rating')).toBeVisible()
  await expect(page.getByTestId('player-summary-rank')).toBeVisible()


  await expect(page.getByTestId('player-summary-win-loss').locator('dd')).toHaveText('0 - 0')
  await expect(page.getByTestId('player-summary-winrate').locator('dd')).toHaveText('0.00%')
  await expect(page.getByTestId('player-summary-rating').locator('dd')).toHaveText('Нет')
  await expect(page.getByTestId('player-summary-rank').locator('dd')).toHaveText('Нет')
});
