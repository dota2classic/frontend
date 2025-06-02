import React from "react";

import c from "./AdminRuleViolationContainer.module.scss";
import { getApi } from "@/api/hooks";
import { PrettyRuleDto, RulePunishmentDto } from "@/api/back";
import { Button, Duration, SelectOptions } from "@/components";
import { observer, useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useAsyncButton } from "@/util/use-async-button";

interface IAdminRuleViolationContainerProps {
  steamId: string;
  onUpdate: () => void;
}

export const AdminRuleViolationContainer: React.FC<IAdminRuleViolationContainerProps> =
  observer(({ steamId, onUpdate }) => {
    const state = useLocalObservable<{
      rule?: PrettyRuleDto;
      punishment?: RulePunishmentDto;
    }>(() => ({}));

    const { data } = getApi().rules.useRuleControllerGetPrettyRules();
    const { data: punishmentsraw } =
      getApi().rules.useRuleControllerGetAllPunishments();

    const rules: PrettyRuleDto[] = data || [];
    const punishments: RulePunishmentDto[] = punishmentsraw || [];

    const [isApplying, applyRule] = useAsyncButton(async () => {
      if (!state.rule) return;
      await getApi().report.reportControllerApplyPunishment({
        steamId,
        ruleId: state.rule.id,
        overridePunishmentId: state.punishment?.id,
      });
      runInAction(() => {
        state.rule = undefined;
        state.punishment = undefined;
      });

      onUpdate();
    }, [onUpdate, steamId]);

    return (
      <div className={c.container}>
        <SelectOptions
          className={c.select}
          defaultText={"Правило"}
          onSelect={(p: { value: number; label: string } | undefined) => {
            runInAction(() => {
              state.rule = rules.find((t) => t.id === p?.value);
            });
          }}
          selected={state.rule?.id}
          options={rules.map((rule) => ({
            label: (
              <>
                {rule.fullIndex}: {rule.title}
              </>
            ),
            value: rule.id,
          }))}
        />

        <SelectOptions
          className={c.select}
          defaultText={"Наказание"}
          onSelect={(p: { value: number; label: string } | undefined) => {
            runInAction(() => {
              state.punishment = punishments.find((t) => t.id === p?.value);
            });
          }}
          selected={state.punishment?.id || state.rule?.punishment?.id}
          options={punishments.map((punishment) => ({
            label: (
              <>
                {punishment.title}:{" "}
                <Duration long duration={punishment.durationHours * 60 * 60} />
              </>
            ),
            value: punishment.id,
          }))}
        />

        <Button small disabled={isApplying || !state.rule} onClick={applyRule}>
          Виновен!
        </Button>
      </div>
    );
  });
