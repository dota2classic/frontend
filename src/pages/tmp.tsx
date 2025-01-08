import React from "react";
import { Message } from "@/components";
import { Rubik } from "next/font/google";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

const stuff: any[] = [
  {
    messageId: "4b900bba-e51d-4a7d-b9ed-22ca8b3428c7",
    threadId: "forum_17aa3530-d152-462e-a032-909ae69019ed",
    content: "Я ипал твая мамка",
    createdAt: "2025-01-07T17:29:56.826Z",
    deleted: false,
    reactions: [],
    reply: {
      messageId: "c846e437-50d4-4653-bfb8-1a190cf46863",
      threadId: "forum_17aa3530-d152-462e-a032-909ae69019ed",
      content:
        "Вот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошлиВот, сразу реги пошли",
      createdAt: "2025-01-07T17:35:56.143Z",
      deleted: false,
      reactions: [],
      author: {
        steamId: "253323011",
        name: "V",
        avatar:
          "https://avatars.steamstatic.com/6ae80592756b9fd8d11ad607618f6ed8829d02e3_full.jpg",
        avatarSmall:
          "https://avatars.steamstatic.com/6ae80592756b9fd8d11ad607618f6ed8829d02e3_medium.jpg",
        roles: ["MODERATOR"],
      },
    },
    author: {
      steamId: "253323011",
      name: "V",
      avatar:
        "https://avatars.steamstatic.com/6ae80592756b9fd8d11ad607618f6ed8829d02e3_full.jpg",
      avatarSmall:
        "https://avatars.steamstatic.com/6ae80592756b9fd8d11ad607618f6ed8829d02e3_medium.jpg",
      roles: ["MODERATOR"],
    },
  },
];

export default function Tmp() {
  return (
    <div className={threadFont.className}>
      <Message messages={stuff} />
    </div>
  );
}
