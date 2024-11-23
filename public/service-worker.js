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


console.log("Service worker root!")

function createHereNotification(inQueue, mode){
  /** @type {NotificationOptions} */
  const options = {
    body: `В поиске уже ${inQueue} человек. Сейчас самое время поиграть в старую доту!`,
    badge: "/minimap.webp",
    vibrate: [100, 50, 100],
    data: {
      type: "@here"
    },
    actions: [
      {
        action: "yes",
        title: "Уже иду"
      },
      {
        action: "no",
        title: "В другой раз"
      }
    ]

  };
  event.waitUntil(
      self.registration.showNotification(
          `Ставь в поиск в режим ${formatGameMode(mode)}`,
          options,
      ),
  );
}


self.addEventListener("push", function (_event) {
  console.log(`PUSH RECEIVED,`, _event);

  /** @type {PushEvent} */
  const event = _event;
  if (event.data) {
    const data = event.data.json();
    // { type: GAME_READY, mode: MatchmakingMode } OR
    // { type: TIME_TO_QUEUE, inQueue: number, mode: MatchmakingMode }

    if (data.type === "TIME_TO_QUEUE") {
      createHereNotification(data.inQueue, data.mode)
    } else if (data.type === "GAME_READY") {
      /** @type {NotificationOptions} */

      const options = {
        body: "Прими найденную игру на сайте dotaclassic.ru",
        badge: "/minimap.webp",
        vibrate: [100, 50, 100],
        requireInteraction: true,
        data: {
          type: "accept"
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

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if(e.data && e.data.type === "@here") {
    if (e.action === 'yes') {
      e.waitUntil(clients.openWindow("https://dotaclassic.ru/queue"));
    } else if (e.action === 'no') {
      // do nothing
    }
  }else if(e.data && e.data.type === "accept") {
    e.waitUntil(clients.openWindow("https://dotaclassic.ru/queue"));
  }

}, false);
