import React, { useState } from "react";

import c from "./ReportCard.module.scss";
import { getApi } from "@/api/hooks";

import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useIsModerator } from "@/util/useIsAdmin";
import { ReportDto, RulePunishmentDto, RuleType } from "@/api/back";
import { useAsyncButton } from "@/util/use-async-button";
import cx from "clsx";
import { LogFileHistory } from "../LogFileHistory";
import { Table } from "@/components/Table";
import { UserPreview } from "@/components/UserPreview";
import { Message } from "@/components/Message";
import { PageLink } from "@/components/PageLink";
import { SelectOptions } from "@/components/SelectOptions";
import { Duration } from "@/components/Duration";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

interface IReportCardProps {
  report: ReportDto;
  punishments: RulePunishmentDto[];
}

export const ReportCard: React.FC<IReportCardProps> = observer(
  ({ report: initialReport, punishments }) => {
    const isModerator = useIsModerator();

    const [report, setReport] = useState<ReportDto>(initialReport);

    const [punishment, setPunishment] = useState<
      RulePunishmentDto | undefined
    >();

    const [isBanning, applyPunishment] = useAsyncButton(async () => {
      const result = await getApi().report.reportControllerHandleReport(
        report.id,
        {
          valid: true,
          overridePunishmentId: punishment?.id,
        },
      );
      setReport(result);
    }, [punishment, report]);

    const [isForgiving, makeInnocent] = useAsyncButton(async () => {
      const result = await getApi().report.reportControllerHandleReport(
        report.id,
        {
          valid: false,
        },
      );
      await setReport(result);
    }, []);

    const isApplying = report?.handled || isBanning || isForgiving;

    return (
      <>
        {report.handled && <h2>Жалоба обработана</h2>}
        <div className={cx(c.card)}>
          <Table className={report.handled ? c.handled : undefined}>
            <tbody>
              <tr>
                <td>Правило</td>
                <td>{report.rule.title}</td>
              </tr>
              <tr>
                <td>Истец</td>
                <td>
                  <UserPreview roles user={report.reporter} />
                </td>
              </tr>
              <tr>
                <td>Обвиняемый</td>
                <td>
                  <UserPreview roles user={report.reported} />
                </td>
              </tr>
              {report.message ? (
                <tr>
                  <td>Сообщение</td>
                  <td>
                    <Message header message={report.message} />
                  </td>
                </tr>
              ) : null}
              {report.matchId ? (
                <tr>
                  <td>Матч</td>
                  <td>
                    <PageLink
                      link={AppRouter.matches.match(report.matchId).link}
                    >
                      {report.matchId}
                    </PageLink>
                  </td>
                </tr>
              ) : null}
              <tr>
                <td>Тип правила</td>
                <td>
                  {report.rule.ruleType === RuleType.COMMUNICATION
                    ? "Коммуникация"
                    : "Геймплей"}
                </td>
              </tr>
              {isModerator && (
                <>
                  <tr>
                    <td>Применить наказание</td>
                    <td>
                      <div className={c.multiButton}>
                        <SelectOptions
                          defaultText={"Наказание"}
                          onSelect={(
                            p: { value: number; label: string } | undefined,
                          ) => {
                            setPunishment(
                              punishments.find((t) => t.id === p?.value),
                            );
                          }}
                          selected={
                            punishment?.id || report.rule.punishment?.id
                          }
                          options={punishments.map((punishment) => ({
                            label: (
                              <>
                                {punishment.title}:{" "}
                                <Duration
                                  long
                                  duration={punishment.durationHours * 60 * 60}
                                />
                              </>
                            ),
                            value: punishment.id,
                          }))}
                        />
                        <Button disabled={isApplying} onClick={applyPunishment}>
                          Виновен!
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Жалоба невалидна</td>
                    <td>
                      <Button disabled={isApplying} onClick={makeInnocent}>
                        Невиновен!
                      </Button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>

          {report.matchId && (
            <Section>
              <header>История сообщений в матче</header>

              <LogFileHistory
                matchId={report.matchId}
                steamId={report.reported.steamId}
              />
            </Section>
          )}
        </div>
      </>
    );
  },
);
