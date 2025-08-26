import React, { useMemo, useRef, useState } from "react";
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
import {
  PlayerInMatchDto,
  PrettyRuleDto,
  RuleType,
  ThreadMessageDTO,
} from "@/api/back";
import c from "./ReportModal.module.scss";
import cx from "clsx";
import { useAsyncButton } from "@/util/use-async-button";
import { useStore } from "@/store";
import { makeSimpleToast } from "@/components/Toast/toasts";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { NotoSans } from "@/const/notosans";
import { threadFont } from "@/const/fonts";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    useGreedyFocus(GreedyFocusPriority.REPORT_MODAL, inputRef);

    const { data } = getApi().rules.useRuleControllerGetPrettyRules();
    const [comment, setComment] = useState("");
    const [selectedReportReason, setSelectedReportReason] = useState<
      number | undefined
    >(undefined);

    const { report } = useStore();

    const options = useMemo(() => {
      let pool = data || [];
      if (!isMatchReportModal(meta)) {
        pool = pool.filter((t) => t.ruleType === RuleType.COMMUNICATION);
      }

      return makeRuleOptions(pool);
    }, [data, meta]);

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
        makeSimpleToast(
          t("report_modal.errorCreatingReport"),
          errMsg,
          5000,
          "error",
        );
      }
      report.clear();
    }, [comment, selectedReportReason]);

    return (
      <GenericModal
        title={t("report_modal.reportPlayer")}
        onClose={onClose}
        className={cx(c.reportModal, NotoSans.className)}
      >
        {isMatchReportModal(meta) && (
          <>
            <div className={c.formItem}>
              <header>{t("report_modal.match")}</header>
              <Input
                readOnly
                value={`${t("report_modal.matchLabel")} ${meta.matchId}`}
              />
            </div>

            <div className={c.formItem}>
              <header>{t("report_modal.offender")}</header>
              <div className={c.player}>
                <HeroIcon small hero={meta.player.hero} />
                {meta.player.user.name}
              </div>
            </div>
          </>
        )}
        {isReportModalMeta(meta) && (
          <>
            <div className={cx(c.formItem, threadFont.className)}>
              <header>{t("report_modal.message")}</header>
              <Message header message={meta.message} />
            </div>

            <div className={c.formItem}>
              <header>{t("report_modal.offender")}</header>
              <UserPreview user={meta.message.author} />
            </div>
          </>
        )}

        <div className={c.formItem}>
          <header>{t("report_modal.brokenRule")}</header>
          <SelectOptions
            defaultText={t("report_modal.ruleItem")}
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
          <header>{t("report_modal.comment")}</header>
          <MarkdownTextarea
            placeholder={t("report_modal.commentPlaceholder")}
            rows={4}
            value={comment}
            ref={inputRef}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button
          disabled={!selectedReportReason || sending || comment.length < 3}
          onClick={sendMatchReport}
        >
          {t("report_modal.sendButton")}
        </Button>
      </GenericModal>
    );
  },
);
