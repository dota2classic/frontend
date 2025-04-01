import React, { useCallback, useRef, useState } from "react";
import { PlayerAspect, PlayerInMatchDto } from "@/api/back";
import {
  Button,
  GenericModal,
  MarkdownTextarea,
  UserPreview,
} from "@/components";
import c from "./PlayerReportModal.module.scss";
import { FaPeopleGroup, FaWheelchairMove } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { formatPlayerAspect } from "@/util/gamemode";
import { GiCrownedSkull, GiPoisonBottle } from "react-icons/gi";
import { MdRecommend } from "react-icons/md";
import cx from "clsx";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { makeSimpleToast } from "@/components/Toast/toasts";

interface IPlayerReportModalProps {
  player: PlayerInMatchDto;
  matchId: number;
  onClose: () => void;
}

const options: {
  aspect: PlayerAspect;
  Icon: IconType;
}[] = [
  {
    aspect: PlayerAspect.FRIENDLY,
    Icon: FaPeopleGroup,
  },
  {
    aspect: PlayerAspect.WINNER,
    Icon: GiCrownedSkull,
  },
  {
    aspect: PlayerAspect.GOOD,
    Icon: MdRecommend,
  },
  {
    aspect: PlayerAspect.TOXIC,
    Icon: GiPoisonBottle,
  },
  {
    aspect: PlayerAspect.RUINER,
    Icon: FaWheelchairMove,
  },
];

export const PlayerReportModal: React.FC<IPlayerReportModalProps> = observer(
  ({ player, matchId, onClose }) => {
    const [comment, setComment] = useState("");
    const [selectedAspect, setSelectedAspect] = useState<
      PlayerAspect | undefined
    >(undefined);
    const { auth } = useStore();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.REPORT_MODAL, textareaRef);

    const report = useCallback(async () => {
      if (selectedAspect === undefined) return;
      await getApi().matchApi.matchControllerReportPlayerInMatch({
        steamId: player.user.steamId,
        matchId,
        aspect: selectedAspect,
        comment: comment,
      });
      await auth.fetchMe();
      onClose();
      makeSimpleToast(
        "Отзыв отправлен",
        `Отзыв об игроке ${player.user.name} успешно сохранен!`,
        5000,
      );
    }, [
      auth,
      comment,
      matchId,
      onClose,
      player.user.name,
      player.user.steamId,
      selectedAspect,
    ]);

    if (!auth.me) return null;

    const isEnabled =
      auth.me.reportsAvailable > 0 && selectedAspect !== undefined;

    return (
      <GenericModal
        className={c.modal}
        title={"Отзыв игроку"}
        onClose={onClose}
      >
        <div className={c.user}>
          <UserPreview user={player.user} />
          <span>Осталось отзывов: {auth.me.reportsAvailable}</span>
        </div>
        <div className={c.categories}>
          {options.map(({ aspect, Icon }) => (
            <div
              onClick={() => setSelectedAspect(aspect)}
              key={aspect}
              className={cx(c.aspect)}
            >
              <span
                className={cx(
                  c.aspect__icon,
                  selectedAspect === aspect && c.aspect__icon__active,
                )}
              >
                <Icon />
                <span>{formatPlayerAspect(aspect)}</span>
              </span>
            </div>
          ))}
        </div>
        <MarkdownTextarea
          ref={textareaRef}
          onChange={(e) => setComment(e.target.value)}
          placeholder={"Комментарий в свободной форме"}
          className={c.comment}
        />
        <Button mega disabled={!isEnabled} onClick={report}>
          Отправить
        </Button>
      </GenericModal>
    );
  },
);
