import React, { useState } from "react";
import { Role, UserConnectionDtoConnectionEnum, UserDTO } from "@/api/back";
import c from "@/components/Username/Username.module.scss";
import { createPortal } from "react-dom";
import { GenericTooltip, Tooltipable } from "@/components";
import { MdAdminPanelSettings } from "react-icons/md";
import { formatRole } from "@/util/gamemode";
import { FaTwitch } from "react-icons/fa";
import cx from "clsx";
import animations from "@/components/Message/ChatIconAnimations.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

interface Props {
  user: UserDTO;
}
export const UsernameRoles: React.FC<Props> = observer(({ user }) => {
  const { t } = useTranslation();
  const { live } = useStore();

  const [hoveredRole, setHoveredRole] = useState<
    { label: string; ref: HTMLElement } | undefined
  >(undefined);

  const twitchConnection = user.connections.find(
    (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
  );

  const liveStream = twitchConnection
    ? live.getLiveStream(user.steamId)
    : undefined;

  const chatIconOld = user.icon;
  const roleList = user.roles.map((t) => t.role);

  const roles = (
    <div className={c.roles}>
      {hoveredRole &&
        createPortal(
          <GenericTooltip
            anchor={hoveredRole.ref}
            onClose={() => setHoveredRole(undefined)}
          >
            <span className={c.roleTooltip}>{hoveredRole.label}</span>
          </GenericTooltip>,
          document.body,
        )}
      {roleList.includes(Role.MODERATOR) && (
        <MdAdminPanelSettings
          className={"bronze"}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label: formatRole(Role.MODERATOR),
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
      {roleList.includes(Role.ADMIN) && (
        <MdAdminPanelSettings
          className={"grey"}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label: formatRole(Role.ADMIN),
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
      {liveStream && (
        <Tooltipable
          className={"purple"}
          tooltip={t("username_roles.streaming_now")}
        >
          <a target="__blank" href={liveStream.link}>
            <FaTwitch />
          </a>
        </Tooltipable>
      )}
      {roleList.includes(Role.OLD) && (
        <img
          src={chatIconOld ? chatIconOld.image.url : "/logo/128.png"}
          className={cx(animations.old, user.chatIconAnimation?.image.key)}
          onMouseEnter={(e) =>
            setHoveredRole({
              ref: e.target as HTMLElement,
              label:
                user.title?.title ||
                t("username_roles.default_subscriber_title"),
            })
          }
          onMouseLeave={() => setHoveredRole(undefined)}
        />
      )}
    </div>
  );

  return roles;
});
