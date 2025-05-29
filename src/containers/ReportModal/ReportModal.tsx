import React, { useState } from "react";
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
            <header>Матч</header>
            <Input readOnly value={`Матч ${meta.matchId}`} />

            <header>Нарушитель</header>
            <div className={c.player}>
              <HeroIcon small hero={meta.player.hero} />
              {meta.player.user.name}
            </div>
          </>
        )}
        {isReportModalMeta(meta) && (
          <>
            <header>Сообщение</header>
            <Message header message={meta.message} />

            <header>Нарушитель</header>
            <UserPreview user={meta.message.author} />
          </>
        )}
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

        <header>Комментарий</header>
        <MarkdownTextarea
          placeholder={"Когда было совершено нарушение, детали"}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button disabled={sending} onClick={sendMatchReport}>
          Отправить
        </Button>
      </GenericModal>
    );
  },
);
