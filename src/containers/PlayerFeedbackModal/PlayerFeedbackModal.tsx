import React, { useCallback, useRef } from "react";
import { MatchReportInfoDto, PlayerAspect, PlayerInMatchDto } from "@/api/back";
import { GenericModal, UserPreview } from "@/components";
import c from "./PlayerFeedbackModal.module.scss";
import { formatPlayerAspect } from "@/util/gamemode";
import cx from "clsx";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { PlayerAspectIcons } from "@/containers/PlayerFeedbackModal/PlayerAspectIcons";

interface IPlayerReportModalProps {
  player: PlayerInMatchDto;
  matchId: number;
  onClose: () => void;
  onReport: (newMatrix: MatchReportInfoDto) => Promise<void>;
}

export const PlayerFeedbackModal: React.FC<IPlayerReportModalProps> = observer(
  ({ player, matchId, onClose, onReport }) => {
    const { auth } = useStore();

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.REPORT_MODAL, textareaRef);

    const report = useCallback(
      async (aspect: PlayerAspect) => {
        try {
          const report =
            await getApi().matchApi.matchControllerReportPlayerInMatch({
              steamId: player.user.steamId,
              matchId,
              aspect,
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
      },
      [auth, matchId, onClose, onReport, player.user.name, player.user.steamId],
    );

    if (!auth.me) return null;

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
              onClick={() => report(aspect)}
              key={aspect}
              className={cx(c.aspect)}
            >
              <span className={cx(c.aspect__icon)}>
                <Icon />
                <span>{formatPlayerAspect(aspect)}</span>
              </span>
            </div>
          ))}
        </div>
      </GenericModal>
    );
  },
);
