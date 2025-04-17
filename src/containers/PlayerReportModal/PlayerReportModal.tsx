import React, { useCallback, useRef, useState } from "react";
import { MatchReportInfoDto, PlayerAspect, PlayerInMatchDto } from "@/api/back";
import {
  Button,
  GenericModal,
  MarkdownTextarea,
  UserPreview,
} from "@/components";
import c from "./PlayerReportModal.module.scss";
import { formatPlayerAspect } from "@/util/gamemode";
import cx from "clsx";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { PlayerAspectIcons } from "@/containers/PlayerReportModal/PlayerAspectIcons";

interface IPlayerReportModalProps {
  player: PlayerInMatchDto;
  matchId: number;
  onClose: () => void;
  onReport: (newMatrix: MatchReportInfoDto) => Promise<void>;
}

export const PlayerReportModal: React.FC<IPlayerReportModalProps> = observer(
  ({ player, matchId, onClose, onReport }) => {
    const [comment, setComment] = useState("");
    const [selectedAspect, setSelectedAspect] = useState<
      PlayerAspect | undefined
    >(undefined);
    const { auth } = useStore();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.REPORT_MODAL, textareaRef);

    const report = useCallback(async () => {
      if (selectedAspect === undefined) return;
      try {
        const report =
          await getApi().matchApi.matchControllerReportPlayerInMatch({
            steamId: player.user.steamId,
            matchId,
            aspect: selectedAspect,
            comment: comment,
          });
        await onReport(report);
        await auth.fetchMe();
        onClose();
        makeSimpleToast(
          "Отзыв отправлен",
          `Отзыв об игроке ${player.user.name} успешно сохранен!`,
          5000,
        );
      } catch (e) {
        console.warn(e);
        makeSimpleToast(
          "Произошла ошибка",
          "Мы не смогли сохранить отзыв об игроке",
          5000,
        );
        await auth.fetchMe();
      }
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
          {PlayerAspectIcons.map(({ aspect, Icon }) => (
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
