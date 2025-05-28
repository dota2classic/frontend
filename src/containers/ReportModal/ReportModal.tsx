import React, { useState } from "react";
import {
  GenericModal,
  HeroIcon,
  Input,
  MarkdownTextarea,
  SelectOptions,
} from "@/components";
import { observer } from "mobx-react-lite";
import { getApi } from "@/api/hooks";
import { PlayerInMatchDto, PrettyRuleDto, UserDTO } from "@/api/back";
import c from "./ReportModal.module.scss";
import cx from "clsx";

// interface IReportModalProps {
//   open: boolean;
//   onClose: () => void;
// }

type MatchReportMeta = { matchId: number; player: PlayerInMatchDto };
type GenericReportMeta = { user: UserDTO };
type RestProps = MatchReportMeta | GenericReportMeta;
type IReportModalProps = {
  onClose: () => void;
  meta: RestProps;
};

function isMatchReportModal(p: RestProps): p is MatchReportMeta {
  return "matchId" in p && "player" in p;
}

// function isReportModalMeta(p: IReportModalProps): p is IReportModalProps {
//   return p["user"];
// }

const makeRuleOptions = (rules: PrettyRuleDto[]) => {
  return rules.map((rule) => ({
    value: rule.id,
    label: rule.fullIndex + ": " + rule.description,
  }));
};

export const ReportModal: React.FC<IReportModalProps> = observer(
  ({ onClose, meta }) => {
    const { data } = getApi().rules.useRuleControllerGetPrettyRules();
    const [comment, setComment] = useState("");
    const [selectedReportReason, setSelectedReportReason] = useState<
      string | undefined
    >(undefined);
    const rules: PrettyRuleDto[] = data || [];

    const options = makeRuleOptions(rules);
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
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </GenericModal>
    );
  },
);
