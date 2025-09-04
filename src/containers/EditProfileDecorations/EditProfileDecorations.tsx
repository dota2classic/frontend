import React, { useCallback } from "react";

import c from "./EditProfileDecorations.module.scss";
import { Message } from "@/components/Message";
import { Panel } from "@/components/Panel";
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
import { SelectImageDecoration } from "./SelectImageDecoration";
import { SelectTextDecoration } from "./SelectTextDecoration";
import { paidAction } from "@/util/subscription";
import { useTranslation } from "react-i18next";

interface IEditProfileDecorationsProps {
  user: UserDTO;
  decorations: ProfileDecorationDto[];
}

export const EditProfileDecorations: React.FC<IEditProfileDecorationsProps> =
  observer(({ user: _user, decorations }) => {
    const { t } = useTranslation();
    const { me, fetchMe } = useStore().auth;

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
      paidAction(async (type: UserProfileDecorationType, id?: number) => {
        await getApi().decoration.customizationControllerSelectDecoration({
          type,
          id,
        });
        await fetchMe();
      }),
      [fetchMe],
    );

    return (
      <>
        <Panel className={cx(c.panel, c.decorations, NotoSans.className)}>
          <Message
            header={true}
            message={{
              author: user,
              blocked: false,
              messageId: "123",
              threadId: "123",
              content: t("edit_profile.messageContent"),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deleted: false,
              edited: false,
              reactions: [],
            }}
          />

          <div className="nicerow">
            <SelectImageDecoration
              decorations={hats}
              current={user.hat}
              onSelect={(it) =>
                updateChatIcon(UserProfileDecorationType.HAT, it)
              }
              title={t("edit_profile.hatTitle")}
            />
            <SelectImageDecoration
              decorations={icons}
              current={user.icon}
              small
              onSelect={(it) =>
                updateChatIcon(UserProfileDecorationType.CHATICON, it)
              }
              title={t("edit_profile.iconTitle")}
            />
            <div className={c.stackedTextSelect}>
              <SelectTextDecoration
                current={user.title}
                decorations={titles}
                onSelect={(it) =>
                  updateChatIcon(UserProfileDecorationType.TITLE, it)
                }
                title={t("edit_profile.titleTitle")}
              />
              <SelectTextDecoration
                current={user.chatIconAnimation}
                decorations={animations}
                onSelect={(it) =>
                  updateChatIcon(
                    UserProfileDecorationType.CHATICONANIMATION,
                    it,
                  )
                }
                title={t("edit_profile.animationTitle")}
              />
            </div>
          </div>
        </Panel>
      </>
    );
  });
