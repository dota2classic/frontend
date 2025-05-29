import React, { useRef, useState } from "react";
import {
  Button,
  GenericModal,
  HeroIcon,
  Input,
  MarkdownTextarea,
  Message,
  SelectOptions,
  UserPreview,
} from "@/components";
import { observer } from "mobx-react-lite";
import { getApi } from "@/api/hooks";
import { PlayerInMatchDto, PrettyRuleDto, ThreadMessageDTO } from "@/api/back";
import c from "./ReportModal.module.scss";
import cx from "clsx";
import { useAsyncButton } from "@/util/use-async-button";
import { useStore } from "@/store";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";

type MatchReportMeta = { matchId: number; player: PlayerInMatchDto };
type MessageReportMeta = { message: ThreadMessageDTO };
export type ReportModalMeta = MatchReportMeta | MessageReportMeta;
type IReportModalProps = {
  meta: ReportModalMeta;
  onClose: () => void;
};

function isMatchReportModal(p: ReportModalMeta): p is MatchReportMeta {
  return "matchId" in p && "player" in p;
}

function isReportModalMeta(p: ReportModalMeta): p is MessageReportMeta {
  return "message" in p;
}

const makeRuleOptions = (rules: PrettyRuleDto[]) => {
  return rules.map((rule) => ({
    value: rule.id,
    label: rule.fullIndex + ": " + rule.title,
  }));
};

export const ReportModal: React.FC<IReportModalProps> = observer(
  ({ meta, onClose }) => {
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.REPORT_MODAL, inputRef);

    const { data } = getApi().rules.useRuleControllerGetPrettyRules();
    const [comment, setComment] = useState("");
    const [selectedReportReason, setSelectedReportReason] = useState<
      number | undefined
    >(undefined);
    const rules: PrettyRuleDto[] = data || [];

    const { report } = useStore();

    const options = makeRuleOptions(rules);

    const [sending, sendMatchReport] = useAsyncButton(async () => {
      if (!selectedReportReason) return;

      try {
        if (isMatchReportModal(meta)) {
          await getApi().report.reportControllerReportPlayerInMatch({
            steamId: meta.player.user.steamId,
            matchId: meta.matchId,
            comment,
            ruleId: selectedReportReason,
          });
        } else if (isReportModalMeta(meta)) {
          await getApi().report.reportControllerReportMessage({
            steamId: meta.message.author.steamId,
            messageId: meta.message.messageId,
            comment,
            ruleId: selectedReportReason,
          });
        }
      } catch (e: unknown) {
        let errMsg = "";
        if (e instanceof Response) {
          const msg = await e.json();
          errMsg = msg.message;
        }
        makeSimpleToast("Ошибка при создании жалобы", errMsg, 5000, "error");
      }
      report.clear();
    }, [comment, selectedReportReason]);

    return (
      <GenericModal
        title={"Жалоба на игрока"}
        onClose={onClose}
        className={cx(c.reportModal)}
      >
        {isMatchReportModal(meta) && (
          <>
            <div className={c.formItem}>
              <header>Матч</header>
              <Input readOnly value={`Матч ${meta.matchId}`} />
            </div>

            <div className={c.formItem}>
              <header>Нарушитель</header>
              <div className={c.player}>
                <HeroIcon small hero={meta.player.hero} />
                {meta.player.user.name}
              </div>
            </div>
          </>
        )}
        {isReportModalMeta(meta) && (
          <>
            <div className={c.formItem}>
              <header>Сообщение</header>
              <Message header message={meta.message} />
            </div>

            <div className={c.formItem}>
              <header>Нарушитель</header>
              <UserPreview user={meta.message.author} />
            </div>
          </>
        )}

        <div className={c.formItem}>
          <header>Нарушенный пункт правил</header>
          <SelectOptions
            defaultText={"Пункт правил"}
            options={options}
            selected={selectedReportReason}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setSelectedReportReason(value.value);
              }
            }}
          />
        </div>

        <div className={c.formItem}>
          <header>Комментарий</header>
          <MarkdownTextarea
            placeholder={"Когда было совершено нарушение, детали"}
            rows={4}
            value={comment}
            ref={inputRef}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button
          disabled={!selectedReportReason || sending}
          onClick={sendMatchReport}
        >
          Отправить
        </Button>
      </GenericModal>
    );
  },
);
