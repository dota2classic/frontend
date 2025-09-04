import React, { useCallback, useMemo, useState } from "react";
import { dataURLToBlob } from "@/util/dataUrlToBlob";
import { getApi } from "@/api/hooks";
import {
  BanReason,
  ProfileDecorationDto,
  Role,
  ThreadMessageDTO,
  UploadedImageDto,
  UserDTO,
  UserProfileDecorationType,
} from "@/api/back";
import { useDebounce } from "react-use";
import { drawImageWithYOffset } from "@/util/createHat";
import { threadFont } from "@/const/fonts";
import { NotoSans } from "@/const/notosans";
import { AppRouter } from "@/route";
import c from "./EditHatContainer.module.scss";
import { useAsyncButton } from "@/util/use-async-button";
import { useTranslation } from "react-i18next";
import { PlayerSummary } from "@/components/PlayerSummary";
import { Section } from "@/components/Section";
import { Message } from "@/components/Message";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

interface IEditHatContainerProps {
  decoration?: ProfileDecorationDto;
  decorationType: UserProfileDecorationType;
}

const uploadImage = async (transformedImage: string) => {
  const blob = dataURLToBlob(transformedImage);
  return getApi().storageApi.storageControllerUploadImage(blob);
};

export const EditHatContainer: React.FC<IEditHatContainerProps> = ({
  decoration,
  decorationType,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | undefined>(undefined);
  const [offset, setOffset] = useState(0);
  const [sideTrim, setSideTrim] = useState(0);
  const [topTrim, setTopTrim] = useState(0);
  const [title, setTitle] = useState(decoration?.title || "");
  const [transformedImage, setTransformedImage] = useState<string | undefined>(
    undefined,
  );

  const supportsImage =
    decorationType == UserProfileDecorationType.HAT ||
    decorationType == UserProfileDecorationType.CHATICON;

  const isButtonEnabled = useMemo(
    () =>
      decoration
        ? !supportsImage || transformedImage || title !== decoration.title
        : (!supportsImage || transformedImage) && title,
    [decoration, supportsImage, title, transformedImage],
  );

  const [creating, createDecoration] = useAsyncButton(async () => {
    let hat: ProfileDecorationDto;

    if (!decoration) {
      // Create new decoration
      let uploadedImage: UploadedImageDto;
      if (supportsImage) {
        if (!transformedImage) return;
        uploadedImage = await uploadImage(transformedImage);
      } else {
        uploadedImage = { url: "", key: "" };
      }
      hat = await getApi().decoration.customizationControllerCreateDecoration({
        title: title,
        imageKey: uploadedImage.key,
        type: decorationType,
      });
    } else {
      let uploadedImage: UploadedImageDto | undefined;
      if (transformedImage) {
        uploadedImage = await uploadImage(transformedImage);
      }
      hat = await getApi().decoration.customizationControllerUpdateDecoration(
        decoration.id,
        {
          title: title,
          imageKey: uploadedImage?.key,
        },
      );
    }

    AppRouter.admin.decoration.edit(hat.id).open();
  }, [transformedImage, decoration, title]);

  const message = useMemo<ThreadMessageDTO>(() => {
    const dec: ProfileDecorationDto = {
      type: decorationType,
      id: 42,
      image: {
        url: transformedImage || decoration?.image?.url || "",
        key: "undefined",
      },
      title: "hat",
    };

    const user: UserDTO = {
      name: "User",
      avatar:
        "https://avatars.cloudflare.steamstatic.com/72b86ac794d4c0a8c2522ea2c2a36edb9f89a989_full.jpg",
      avatarSmall: "",
      steamId: "253323011",
      roles: [
        {
          role: Role.OLD,
          endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        },
      ],
      connections: [],
    };

    if (decorationType == UserProfileDecorationType.HAT) {
      user.hat = dec;
    } else if (decorationType === UserProfileDecorationType.CHATICON) {
      user.icon = dec;
    } else if (decorationType === UserProfileDecorationType.TITLE) {
      user.title = dec;
    }
    return {
      author: user,
      messageId: "123",
      blocked: false,
      threadId: "123",
      content: "Я помогаю проекту dotaclassic.ru!",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      edited: false,
      reactions: [],
    };
  }, [decoration?.image?.url, decorationType, transformedImage]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files![0];
        setFile(file);
      }
    },
    [],
  );

  const deleteDecoration = useCallback(async () => {
    if (!decoration) return;
    await getApi().decoration.customizationControllerDeleteDecoration(
      decoration.id,
    );
    AppRouter.admin.decoration.list(decorationType).open();
  }, [decoration, decorationType]);

  useDebounce(
    async () => {
      if (!file) return;
      if (decorationType === UserProfileDecorationType.HAT) {
        const scale = 4;
        drawImageWithYOffset(
          file,
          offset,
          45 * scale,
          70 * scale,
          sideTrim,
          topTrim,
        ).then(setTransformedImage);
      } else if (decorationType === UserProfileDecorationType.CHATICON) {
        drawImageWithYOffset(file, 0, 64, 64, 0, 0).then(setTransformedImage);
      }
    },
    300,
    [file, offset, sideTrim, topTrim],
  );

  return (
    <>
      <PlayerSummary
        banStatus={{
          status: BanReason.INFINITE_BAN,
          isBanned: false,
          bannedUntil: new Date().toISOString(),
        }}
        stats={{
          gamesPlayed: 52,
          wins: 52,
          loss: 52,
          abandons: 52,
          kills: 52,
          deaths: 52,
          assists: 52,
          playtime: 52,
          recalibrationAttempted: true,
        }}
        user={message.author}
      />

      <Section>
        <header>
          {t("edit_hat_container.chatPreviewHeader", { decorationType })}
        </header>
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
        <header>{t("edit_hat_container.settingsHeader")}</header>
        {decoration && (
          <Button mega onClick={deleteDecoration}>
            {t("edit_hat_container.deleteDecorationButton")}
          </Button>
        )}
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
          {supportsImage && (
            <>
              <div className={c.row}>
                <input
                  id="editor-toolbar-upload-file"
                  type="file"
                  className={c.hiddenInput}
                  onChange={handleFileChange}
                />
                <button>
                  <label htmlFor="editor-toolbar-upload-file">
                    {t("edit_hat_container.chooseImageButton")}
                  </label>
                </button>
                <img
                  style={{ border: "1px solid red" }}
                  src={transformedImage}
                  alt=""
                />
              </div>

              <div className={c.row}>
                <header>{t("edit_hat_container.verticalOffsetHeader")}</header>
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min="0"
                  max="512"
                  value={offset}
                  step="1"
                  onChange={(e) => setOffset(Number(e.target.value))}
                />
              </div>
              <div className={c.row}>
                <header>{t("edit_hat_container.horizontalTrimHeader")}</header>
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min="0"
                  max="500"
                  value={sideTrim}
                  step="1"
                  onChange={(e) => setSideTrim(Number(e.target.value))}
                />
              </div>

              <div className={c.row}>
                <header>{t("edit_hat_container.topTrimHeader")}</header>
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
            </>
          )}
          <Input
            placeholder={t("edit_hat_container.hatNamePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            disabled={creating || !isButtonEnabled}
            onClick={createDecoration}
            mega
          >
            {decoration
              ? t("edit_hat_container.saveDecorationButton")
              : t("edit_hat_container.createDecorationButton")}
          </Button>
        </Panel>
      </Section>
    </>
  );
};
