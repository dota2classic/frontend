import { describe } from "node:test";
import { ThreadMessageDTO } from "@/api/back";

describe("render message", () => {
  const props: ThreadMessageDTO = {
    messageId: "6f595a3d-39cb-4324-b7a5-0f3a8ccd8ea3",
    threadId: "forum_17aa3530-d152-462e-a032-909ae69019ed",
    content: "bbbbbbb",
    createdAt: "2025-01-08T20:31:07.956Z",
    updatedAt: "2025-01-08T23:28:23.394Z",
    deleted: false,
    reactions: [
      {
        emoticon: {
          code: "relieved",
          id: 106,
          src: "https://s3.dotaclassic.ru/emoticons/relieved.gif",
        },
        reacted: [
          {
            steamId: "116514945",
            name: "Psychology Professor",
            avatar:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
            avatarSmall:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        emoticon: {
          code: "eh",
          id: 111,
          src: "https://s3.dotaclassic.ru/emoticons/eh.gif",
        },
        reacted: [
          {
            steamId: "116514945",
            name: "Psychology Professor",
            avatar:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
            avatarSmall:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        emoticon: {
          code: "charm_crazy",
          id: 125,
          src: "https://s3.dotaclassic.ru/emoticons/charm_crazy.gif",
        },
        reacted: [
          {
            steamId: "116514945",
            name: "Psychology Professor",
            avatar:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
            avatarSmall:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        emoticon: {
          code: "snort",
          id: 423,
          src: "https://s3.dotaclassic.ru/emoticons/snort.gif",
        },
        reacted: [
          {
            steamId: "116514945",
            name: "Psychology Professor",
            avatar:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
            avatarSmall:
              "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
    reply: {
      messageId: "c494e862-cdbe-4c81-985b-7b6a4b343aed",
      threadId: "forum_17aa3530-d152-462e-a032-909ae69019ed",
      content: "aaaaaa",
      createdAt: "2025-01-08T20:30:40.749Z",
      updatedAt: "2025-01-08T20:30:40.749Z",
      deleted: false,
      reactions: [],
      author: {
        steamId: "116514945",
        name: "Psychology Professor",
        avatar:
          "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
        avatarSmall:
          "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
        roles: ["ADMIN"],
      },
    },
    author: {
      steamId: "116514945",
      name: "Psychology Professor",
      avatar:
        "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
      avatarSmall:
        "https://avatars.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_medium.jpg",
      roles: ["ADMIN"],
    },
  } as any;


  it('should render fd', () => {

  });
});
