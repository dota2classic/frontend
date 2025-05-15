import React, { useCallback } from "react";

import c from "./EditProfileDecorations.module.scss";
import { Message, Panel } from "@/components";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import {
  ProfileDecorationDto,
  UserDTO,
  UserProfileDecorationType,
} from "@/api/back";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { SelectImageDecoration } from "@/containers/EditProfileDecorations/SelectImageDecoration";
import { SelectTextDecoration } from "@/containers/EditProfileDecorations/SelectTextDecoration";

// import { useRouter } from "next/router";

interface IEditProfileDecorationsProps {
  user: UserDTO;
  decorations: ProfileDecorationDto[];
}

export const EditProfileDecorations: React.FC<IEditProfileDecorationsProps> =
  observer(({ user: _user, decorations }) => {
    const { me, fetchMe, isOld } = useStore().auth;
    // const router = useRouter();

    const user = me?.user || _user;

    const hats = decorations.filter(
      (t) => t.type === UserProfileDecorationType.HAT,
    );

    const icons = decorations.filter(
      (t) => t.type === UserProfileDecorationType.CHATICON,
    );

    const titles = decorations.filter(
      (t) => t.type === UserProfileDecorationType.TITLE,
    );

    const animations = decorations.filter(
      (t) => t.type === UserProfileDecorationType.CHATICONANIMATION,
    );

    const updateChatIcon = useCallback(
      async (type: UserProfileDecorationType, id?: number) => {
        if (!isOld) {
          // AppRouter.
          console.error("TODO FIXME");
        }
        await getApi().decoration.customizationControllerSelectDecoration({
          type,
          id,
        });
        await fetchMe();
      },
      [fetchMe],
    );

    return (
      <>
        <Panel className={cx(c.panel, NotoSans.className)}>
          <Message
            header={true}
            message={{
              author: user,
              messageId: "123",
              threadId: "123",
              content: "Я помогаю проекту dotaclassic.ru!",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deleted: false,
              edited: false,
              reactions: [],
            }}
          />
        </Panel>
        <Panel className={cx(c.panel, c.decorations, NotoSans.className)}>
          <SelectImageDecoration
            decorations={hats}
            current={user.hat}
            onSelect={(it) => updateChatIcon(UserProfileDecorationType.HAT, it)}
            title={"Шапка"}
          />
          <SelectImageDecoration
            decorations={icons}
            current={user.icon}
            small
            onSelect={(it) =>
              updateChatIcon(UserProfileDecorationType.CHATICON, it)
            }
            title={"Иконка"}
          />
          <div className={c.stackedTextSelect}>
            <SelectTextDecoration
              current={user.title}
              decorations={titles}
              onSelect={(it) =>
                updateChatIcon(UserProfileDecorationType.TITLE, it)
              }
              title={"Титул"}
            />
            <SelectTextDecoration
              current={user.chatIconAnimation}
              decorations={animations}
              onSelect={(it) =>
                updateChatIcon(UserProfileDecorationType.CHATICONANIMATION, it)
              }
              title={"Анимация"}
            />
          </div>
        </Panel>

        {/*<Panel className={cx(c.panel, c.icons, NotoSans.className)}>*/}
        {/*  <header>Титул</header>*/}
        {/*  */}
        {/*</Panel>*/}
      </>
    );
  });
