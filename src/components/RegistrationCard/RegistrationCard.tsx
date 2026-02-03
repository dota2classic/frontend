import React from "react";

import c from "./RegistrationCard.module.scss";
import {
  RegistrationDto,
  RegistrationDtoStateEnum,
  RegistrationPlayerDtoStateEnum,
} from "@/api/back";
import { AppRouter } from "@/route";
import { Badge } from "@/components/Badge";
import { TranslationKey } from "@/TranslationKey";
import { useTranslation } from "react-i18next";
import { BadgeVariant } from "@/components/Badge/Badge";
import { FaCheck } from "react-icons/fa6";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import cx from "clsx";
import { CgSandClock } from "react-icons/cg";

interface IRegistrationCardProps {
  registration: RegistrationDto;
}

const StatusMapping: Record<RegistrationDtoStateEnum, BadgeVariant> = {
  [RegistrationDtoStateEnum.CREATED]: "grey",
  [RegistrationDtoStateEnum.PENDINGCONFIRMATION]: "grey",
  [RegistrationDtoStateEnum.CONFIRMED]: "green",
  [RegistrationDtoStateEnum.DECLINED]: "yellow",
  [RegistrationDtoStateEnum.TIMEDOUT]: "blue",
};

export const RegistrationCard: React.FC<IRegistrationCardProps> = ({
  registration,
}) => {
  const { t } = useTranslation();
  return (
    <div className={c.card}>
      <div className={c.players}>
        {registration.players.map((plr) => (
          <div className={c.avatar} key={plr.user.steamId}>
            <span className={c.status__container}>
              {plr.state === RegistrationPlayerDtoStateEnum.CONFIRMED &&
                c.ready && <FaCheck />}
              {plr.state ===
                RegistrationPlayerDtoStateEnum.PENDINGCONFIRMATION &&
                c.ready && <CgSandClock />}
              {plr.state === RegistrationPlayerDtoStateEnum.DECLINED &&
                c.ready && <FaCheck />}
            </span>
            <PlayerAvatar
              className={cx(
                plr.state ===
                  RegistrationPlayerDtoStateEnum.PENDINGCONFIRMATION &&
                  c.pending,
                plr.state === RegistrationPlayerDtoStateEnum.CONFIRMED &&
                  c.ready,
                (plr.state === RegistrationPlayerDtoStateEnum.DECLINED ||
                  plr.state === RegistrationPlayerDtoStateEnum.TIMEDOUT) &&
                  c.declined,
                plr.state === RegistrationPlayerDtoStateEnum.CREATED &&
                  c.created,
              )}
              width={45}
              height={45}
              user={plr.user}
              alt=""
              link={AppRouter.players.player.index(plr.user.steamId).link}
            />
          </div>
        ))}
      </div>
      <div className={c.title}>{registration.title || "Участник"}</div>
      <Badge className={c.badge} variant={StatusMapping[registration.state]}>
        {t(`tournament.registration.${registration.state}` as TranslationKey)}
      </Badge>
    </div>
  );
};
