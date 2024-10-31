self.addEventListener("push", function (_event) {
  // console.log(`PUSH RECEIVED,`, _event);

  /** @type {PushEvent} */
  const event = _event;
  if (event.data) {
    const data = event.data.json();
    /** @type {NotificationOptions} */
    const options = {
      body: JSON.stringify(data),
      badge: "/minimap.webp",
      vibrate: [100, 50, 100],
      requireInteraction: true,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(
      self.registration.showNotification("В поиске уже хуй", options),
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://dotaclassic.ru"));
});
