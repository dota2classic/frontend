const messages = {
  // MatchmakingMode.TOURNAMENT
  6: "Турнир 5х5",
  // MatchmakingMode.TOURNAMENT_SOLOMID
  9: "Турнир 1x1",
  // MatchmakingMode.RANKED
  0: "Рейтинг",
  // MatchmakingMode.UNRANKED
  1: "Обычная 5x5",
  // MatchmakingMode.SOLOMID
  2: "1x1 мид",
  // MatchmakingMode.ABILITY_DRAFT
  5: "Ability draft",
  // MatchmakingMode.DIRETIDE
  3: "Diretide",
  // MatchmakingMode.HIGHROOM
  8: "High room",
  // MatchmakingMode.BOTS
  7: "Обучение",
  // MatchmakingMode.GREEVILING
  4: "Гряволы",
  // MatchmakingMode.CAPTAINS_MODE
  10: "Captains Mode",
};

function formatGameMode(mode) {
  return messages[mode];
}


console.log("service worker: root")


self.addEventListener("push", function (_event) {
  console.log(`PUSH RECEIVED,`, _event);

  /** @type {PushEvent} */
  const event = _event;
  if (event.data) {
    const data = event.data.json();
    // { type: GAME_READY, mode: MatchmakingMode } OR
    // { type: TIME_TO_QUEUE, inQueue: number, mode: MatchmakingMode }

    if (data.type === "TIME_TO_QUEUE") {
      /** @type {NotificationOptions} */
      const options = {
        body: `В поиске уже ${data.inQueue} человек. Сейчас самое время поиграть в старую доту!`,
        badge: "/minimap.webp",
        vibrate: [100, 50, 100],
        requireInteraction: true,
        actions: [
          {
            action: "reply",
            title: "Reply",
            type: "text",
            placeholder: "Reply Comment",
          }
        ]

      };
      event.waitUntil(
        self.registration.showNotification(
          `Ставь в поиск в режим ${formatGameMode(data.mode)}`,
          options,
        ),
      );
    } else if (data.type === "GAME_READY") {
      /** @type {NotificationOptions} */

      const options = {
        body: "Прими найденную игру на сайте dotaclassic.ru",
        badge: "/minimap.webp",
        vibrate: [100, 50, 100],
        requireInteraction: true,
        data: {
          dateOfArrival: Date.now(),
          primaryKey: "2",
        },
      };
      event.waitUntil(
        self.registration.showNotification(
          `Игра в режиме ${data.mode} найдена!`,
          options,
        ),
      );
    }
  }
});

self.addEventListener("notificationclick",  (e) => {
  console.log("Notification click received.");
  e.notification.close();
  e.waitUntil(clients.openWindow("https://dotaclassic.ru"));
});