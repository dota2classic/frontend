import { expect, test, WebSocketRoute } from "@playwright/test";
import * as dotenv from "dotenv";
import { MessageTypeC2S } from "@/store/queue/messages/c2s/message-type.c2s";
import { MessageTypeS2C } from "@/store/queue/messages/s2c/message-type.s2c";
import { PlayerQueueStateMessageS2C } from "@/store/queue/messages/s2c/player-queue-state-message.s2c";
import { MatchmakingMode } from "@/api/mapped-models";
import { QueueStateMessageS2C } from "@/store/queue/messages/s2c/queue-state-message.s2c";
import {
  PlayerRoomEntry,
  PlayerRoomStateMessageS2C,
  ReadyState,
} from "@/store/queue/messages/s2c/player-room-state-message.s2c";
import { PlayerGameStateMessageS2C } from "@/store/queue/messages/s2c/player-game-state-message.s2c";

dotenv.config();
const STEAM_ID = process.env.PLAYWRIGHT_NEWBIE_USER_ID;
const USERNAME = process.env.PLAYWRIGHT_NEWBIE_USER_NAME;

test.beforeEach(async ({ page, context }) => {
  console.log("Fake secret:", process.env.FAKE_SECRET)
  await context.addCookies([
    {
      name: "dota2classic_auth_token",
      value: process.env.PLAYWRIGHT_NEWBIE_USER,
      domain: "127.0.0.1",
      path: "/",
      expires: -1,
    },
  ]);
});

test.afterEach(async ({ page, context }) => {
  await context.clearCookies();
});

test("should render profile page for complete newbie", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("/");
  // We have our profile in navbar
  await expect(page.getByTestId("navbar-user")).toBeVisible({ timeout: 5000 });

  await page.goto(`/players/${STEAM_ID}`);
  await expect(page.getByTestId("player-matches-header")).toBeVisible();
  await expect(
    page.getByTestId("player-hero-performance-header"),
  ).toBeVisible();

  await expect(page.getByTestId("player-teammates-header")).toBeVisible();
  await expect(page.getByTestId("player-summary-panel")).toBeVisible();
  await expect(page.getByTestId("player-summary-player-name")).toHaveText(
    USERNAME,
  );
  await expect(page.getByTestId("player-summary-last-game")).not.toBeAttached();

  await expect(page.getByTestId("player-summary-win-loss")).toBeVisible();
  await expect(page.getByTestId("player-summary-winrate")).toBeVisible();
  await expect(page.getByTestId("player-summary-rating")).toBeVisible();
  await expect(page.getByTestId("player-summary-rank")).toBeVisible();

  await expect(
    page.getByTestId("player-summary-win-loss").locator("dd"),
  ).toHaveText("0 - 0");
  await expect(
    page.getByTestId("player-summary-winrate").locator("dd"),
  ).toHaveText("0.00%");
  await expect(
    page.getByTestId("player-summary-rating").locator("dd"),
  ).toHaveText("Нет");
  await expect(
    page.getByTestId("player-summary-rank").locator("dd"),
  ).toHaveText("Нет");

  await page.goto(`/players/${STEAM_ID}/matches?page=0`);
});

test("should be able to enter queue w/ mobile", async ({ page }) => {
  console.log("Route websocket");
  const encodeSocketIO = (name: string, payload: unknown) => {
    return `42${JSON.stringify([name, payload])}`;
  };

  const decodeSocketIO = (message: Buffer | string): [string, any] => {
    message = message.toString();
    console.log("Hello", message);
    const isMetaMessage =
      message.indexOf("[") === -1 || message.indexOf("[") > 3;
    if (isMetaMessage) return [message, {}];
    return JSON.parse(message.slice(message.indexOf("[")));
  };

  let mainSocket: WebSocketRoute;

  await page.routeWebSocket(
    (url) => {
      return url.href.includes("wss://dotaclassic.ru/newsocket");
    },
    (ws) => {
      mainSocket = ws;
      const server = ws.connectToServer();
      console.log(`MOCKING + connected ${ws.url()}`);

      ws.onMessage(async (message) => {
        // 42[name,payload]
        const [name, payload] = decodeSocketIO(message);

        if (name === MessageTypeC2S.ENTER_QUEUE) {
          ws.send(
            encodeSocketIO(
              MessageTypeS2C.QUEUE_STATE,
              new QueueStateMessageS2C(payload.mode, payload.version, 1),
            ),
          );
          // no thanks
          ws.send(
            encodeSocketIO(
              MessageTypeS2C.PLAYER_QUEUE_STATE,
              new PlayerQueueStateMessageS2C(payload.mode, payload.version),
            ),
          );
        } else if (name === MessageTypeC2S.SET_READY_CHECK) {
          ws.send(
            encodeSocketIO(
              MessageTypeS2C.PLAYER_ROOM_STATE,
              new PlayerRoomStateMessageS2C("room-1", mode, [
                new PlayerRoomEntry(STEAM_ID, ReadyState.READY),
              ]),
            ),
          );
          await new Promise((resolve) => setTimeout(resolve, 500));

          ws.send(
            encodeSocketIO(
              MessageTypeS2C.PLAYER_GAME_READY,
              new PlayerGameStateMessageS2C("server1:27015"),
            ),
          );
        } else {
          return server.send(message);
        }
      });

      server.onMessage((message) => {
        ws.send(message);
      });
    },
  );

  await page.goto("/queue");

  const mode = MatchmakingMode.BOTS;

  await page.getByTestId(`mode-list-option-${mode}`).click();

  // need await socket validation
  await expect(
    page.getByTestId("floater-play-button-enter-queue"),
  ).toBeVisible();

  // Enter queue
  await page.getByTestId("floater-play-button-enter-queue").click();
  await expect(page.getByTestId("floater-play-button-leave-queue")).toBeVisible(
    { timeout: 5000 },
  );
  await expect(
    page.getByTestId(`mode-list-option-${mode}`).locator("> span"),
  ).toHaveText(/1 в поиске/i);

  mainSocket.send(
    encodeSocketIO(
      MessageTypeS2C.PLAYER_ROOM_FOUND,
      new PlayerRoomStateMessageS2C("room-1", mode, [
        new PlayerRoomEntry(STEAM_ID, ReadyState.PENDING),
      ]),
    ),
  );

  // Modal for game accept is visible
  await expect(page.getByTestId("accept-modal-waiting-user")).toBeVisible();
  await expect(
    page
      .getByTestId("accept-modal-waiting-user")
      .getByRole("button", { name: /принять/i }),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("accept-modal-waiting-user")
      .getByRole("button", { name: /отклонить/i }),
  ).toBeVisible();

  // Accept game
  await page
    .getByTestId("accept-modal-waiting-user")
    .getByRole("button", { name: /принять/i })
    .click();

  // Show game ready modal
  await expect(page.getByTestId("game-ready-modal")).toBeVisible();
  await expect(
    page.getByTestId("game-ready-modal").getByTestId("copy-something"),
  ).toHaveValue(`connect server1:27015`);
});
