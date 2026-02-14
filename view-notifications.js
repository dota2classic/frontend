// Test all notification types
function testAllNotifications() {
  const store = window.store.notify;

  // Helper to create base notification
  const createNotification = (type, overrides = {}) => ({
    id: `test-${type}-${Date.now()}`,
    notificationType: type,
    title: `Test ${type}`,
    content: `Test content for ${type}`,
    expiresAt: new Date(Date.now() + 60000).toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  // 1. Report Created
  store.addNotification(
    createNotification("REPORT_CREATED", {
      entityId: "report_123",
      title: "Report Created",
      content: "Your report has been created",
    }),
  );

  // 2. Achievement Complete
  store.addNotification(
    createNotification("ACHIEVEMENT_COMPLETE", {
      steamId: "76561198000000000",
      achievement: { key: "first_blood" },
      params: { checkpoints: [1, 5, 10], progress: 5 },
    }),
  );

  // 3. Feedback Created
  store.addNotification(
    createNotification("FEEDBACK_CREATED", {
      entityId: "1",
      feedback: { title: "Оцени свой опыт игры" },
    }),
  );

  // 4. Player Feedback
  store.addNotification(
    createNotification("PLAYER_FEEDBACK", {
      match: { id: 12345 },
    }),
  );

  // 5. Item Dropped
  store.addNotification(
    createNotification("ITEM_DROPPED", {
      entityId: JSON.stringify({
        marketHashName: "AMogus!!",
        image:
          "https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttydbPaERSR0Wqmu7LAocGIyi3kajH_fa18OsNHySqkRw5JX970_ifhL3oYLo-B1Y4_e8b71SIeOQC3OZwtFJv-dvRyi9kVI1ti2Xk4rvJBTIOGlkUscfFrtf8Efx_YWkZL-mvlax5NQTm3Sv0H5XvXs65O5RBPYmqfDXigzJYrc64ZEFdaqkSE-NUBVevalrQovhmNtDClIJWXdrUUmjlw/item.png",
        rarity: "Immortal",
      }),
    }),
  );

  // 6. Ticket Created
  store.addNotification(
    createNotification("TICKET_CREATED", {
      thread: { externalId: "ticket_456" },
    }),
  );

  // 7. Ticket New Message
  store.addNotification(
    createNotification("TICKET_NEW_MESSAGE", {
      thread: { externalId: "ticket_456" },
    }),
  );

  // 8. Trade Offer Expired
  store.addNotification(
    createNotification("TRADE_OFFER_EXPIRED", {
      entityId: "76561198000000000",
    }),
  );

  // 9. Tournament Ready Check
  store.addNotification(
    createNotification("TOURNAMENT_READY_CHECK_STARTED", {
      params: { tournamentId: 1 },
    }),
  );

  // 10. Tournament Registration Invitation
  store.addNotification(
    createNotification("TOURNAMENT_REGISTRATION_INVITATION_CREATED", {
      entityId: "76561198000000000",
      params: { invitationId: "inv_123", tournamentId: 1 },
    }),
  );

  // 11. Tournament Invitation Resolved (Accepted)
  store.addNotification(
    createNotification("TOURNAMENT_REGISTRATION_INVITATION_RESOLVED", {
      params: { steamId: "76561198000000000", accept: true },
    }),
  );

  // 12. Tournament Invitation Resolved (Declined)
  setTimeout(() => {
    store.addNotification(
      createNotification("TOURNAMENT_REGISTRATION_INVITATION_RESOLVED", {
        params: { steamId: "76561198000000000", accept: false },
      }),
    );
  }, 1000);

  console.log("✅ All notification types added!");
}

// Run it
testAllNotifications();
