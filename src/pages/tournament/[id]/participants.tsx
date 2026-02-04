import { TournamentDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import React from "react";
import { TournamentTabs } from "@/components/TournamentTabs";
import c from "./TournamentStyles.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { RegistrationCard } from "@/components/RegistrationCard";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { NextPageContext } from "next";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

interface Props {
  id: number;
  tournament: TournamentDto;
}

export default function TournamentPage({ tournament }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <EmbedProps
        title={t("tournament.seo.participants.title", {
          name: tournament.name,
        })}
        description={t("tournament.seo.participants.description", {
          name: tournament.name,
        })}
      />
      <TournamentTabs tournament={tournament} />
      <div className={cx(c.container, NotoSans.className)}>
        <QueuePageBlock className={c.fullwidth} heading="Участники">
          <div className={c.participants}>
            {tournament.registrations.map((reg) => (
              <RegistrationCard key={reg.id} registration={reg} />
            ))}
          </div>
        </QueuePageBlock>
      </div>
    </div>
  );
}

TournamentPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  return {
    id,
    tournament: await getApi().tournament.tournamentControllerGetTournament(id),
  };
};
