import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Input,
  Message,
  Panel,
  PlayerSummary,
  Section,
} from "@/components";
import { Role } from "@/api/mapped-models";
import { ThreadMessageDTO, UserProfileDecorationType } from "@/api/back";
import { drawImageWithYOffset } from "@/util/createHat";
import { useDebounce } from "react-use";
import c from "./AdminStyles.module.scss";
import { getApi } from "@/api/hooks";
import { dataURLToBlob } from "@/util/dataUrlToBlob";
import { NotoSans } from "@/const/notosans";
import { threadFont } from "@/const/fonts";

export default function CreateHatPage() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [sideTrim, setSideTrim] = useState(0);
  const [topTrim, setTopTrim] = useState(0);
  const [title, setTitle] = useState("");
  const [transformedImage, setTransformedImage] = useState<string | undefined>(
    undefined,
  );

  const createDecoration = useCallback(async () => {
    if (!transformedImage) return;
    const blob = dataURLToBlob(transformedImage);
    const imageKey =
      await getApi().storageApi.storageControllerUploadImage(blob);
    await getApi().decoration.customizationControllerCreateDecoration({
      title: title,
      imageKey: imageKey.key,
      type: UserProfileDecorationType.HAT,
    });

    window.location.reload();
  }, [transformedImage, title]);

  const message = useMemo<ThreadMessageDTO>(
    () => ({
      author: {
        name: "User",
        avatar:
          "https://avatars.cloudflare.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
        avatarSmall: "",
        steamId: "253323011",
        roles: [Role.OLD],
        connections: [],
        hat: transformedImage
          ? {
              type: UserProfileDecorationType.HAT,
              id: 42,
              image: {
                url: transformedImage,
                key: "undefined",
              },
              title: "hat",
            }
          : undefined,
      },
      messageId: "123",
      threadId: "123",
      content: "Я помогаю проекту dotaclassic.ru!",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      edited: false,
      reactions: [],
    }),
    [transformedImage],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files![0];
        setFile(file);
      }
    },
    [],
  );

  useDebounce(
    async () => {
      if (!file) return;
      const scale = 4;
      drawImageWithYOffset(
        file,
        offset,
        45 * scale,
        70 * scale,
        sideTrim,
        topTrim,
      ).then(setTransformedImage);
    },
    300,
    [file, offset, sideTrim, topTrim],
  );

  return (
    <>
      <PlayerSummary
        stats={{
          gamesPlayed: 52,
          wins: 52,
          loss: 52,
          abandons: 52,
          kills: 52,
          deaths: 52,
          assists: 52,
          playtime: 52,
        }}
        user={message.author}
      />

      <Section>
        <header>Превью в чате</header>
        <Panel
          style={{ flexDirection: "column", alignItems: "flex-start" }}
          className={threadFont.className}
        >
          <Message
            header={true}
            message={{
              ...message,
              author: {
                ...message.author,
                hat: undefined,
              },
            }}
          />
          <Message header={true} message={message} />
        </Panel>
      </Section>

      <Section>
        <header>Настройки</header>
        <Panel
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 20,
          }}
          className={NotoSans.className}
        >
          <div className={c.row}>
            <input
              id="editor-toolbar-upload-file"
              type="file"
              className={c.hiddenInput}
              onChange={handleFileChange}
            />
            <button>
              <label htmlFor="editor-toolbar-upload-file">
                Выбрать картинку
              </label>
            </button>
            <img
              style={{ border: "1px solid red" }}
              src={transformedImage}
              alt=""
            />
          </div>

          <div className={c.row}>
            <header>Отступ по вертикали</header>
            <input
              type="range"
              id="cowbell"
              name="cowbell"
              min="0"
              max="50"
              value={offset}
              step="1"
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </div>
          <div className={c.row}>
            <header>Обрезать края по горизонтали</header>
            <input
              type="range"
              id="cowbell"
              name="cowbell"
              min="0"
              max="100"
              value={sideTrim}
              step="1"
              onChange={(e) => setSideTrim(Number(e.target.value))}
            />
          </div>

          <div className={c.row}>
            <header>Обрезать сверху</header>
            <input
              type="range"
              id="cowbell"
              name="cowbell"
              min="0"
              max="500"
              value={topTrim}
              step="1"
              onChange={(e) => setTopTrim(Number(e.target.value))}
            />
          </div>

          {/*<div className={c.row}>*/}
          {/*  <h2>raw Image</h2>*/}
          {/*  */}
          {/*</div>*/}
          <Input
            placeholder={"Название шапки"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            disabled={!title || !transformedImage}
            onClick={createDecoration}
            mega
          >
            Сохранить шапку
          </Button>
        </Panel>
      </Section>
    </>
  );
}
