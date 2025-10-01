import { NextPageContext } from "next";
import React, { useMemo } from "react";
import { AchievementDto, AchievementKey, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";
import { PlayerSummary } from "@/components/PlayerSummary";
import { AchievementStatus } from "@/components/AchievementStatus";
import c from "@/pages/players/[id]/PlayerPage.module.scss";
import { Panel } from "@/components/Panel";
import { EmbedProps } from "@/components/EmbedProps";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

interface Props {
  summary: PlayerSummaryDto;
  achievements: AchievementDto[];
  playerId: string;
}
const Unique: AchievementKey[] = [
  AchievementKey.GPM_XPM_1000,
  AchievementKey.MEAT_GRINDER,
  AchievementKey.WIN_1HR_GAME,
  AchievementKey.WIN_1HR_GAME_AGAINST_TECHIES,
  AchievementKey.HARDCORE,
  AchievementKey.GLASSCANNON,

  AchievementKey.WIN_BOT_GAME,
  AchievementKey.WIN_SOLOMID_GAME,
  AchievementKey.WIN_UNRANKED_GAME,
  AchievementKey.ALL_MELEE,
];

const Records: AchievementKey[] = [
  AchievementKey.MAX_KILLS,
  AchievementKey.MAX_ASSISTS,

  AchievementKey.LAST_HITS_1000,
  AchievementKey.DENIES_50,
  AchievementKey.HERO_DAMAGE,
  AchievementKey.TOWER_DAMAGE,
  AchievementKey.HERO_HEALING,

  AchievementKey.GPM_1000,
  AchievementKey.XPM_1000,
  AchievementKey.MISSES,
];

const Progress: AchievementKey[] = [
  AchievementKey.KILLS,
  AchievementKey.ASSISTS,

  AchievementKey.LAST_HITS_SUM,
  AchievementKey.DENY_SUM,

  AchievementKey.HERO_DAMAGE_SUM,
  AchievementKey.TOWER_DAMAGE_SUM,
  AchievementKey.HERO_HEALING_SUM,

  AchievementKey.WINSTREAK_10,
  AchievementKey.ALL_HERO_CHALLENGE,
  AchievementKey.DEATH_SUM,
];

const useFilteredAchievements = (
  achievements: AchievementDto[],
  filter: AchievementKey[],
): AchievementDto[] => {
  return useMemo(
    () =>
      achievements
        .filter((it) => filter.includes(it.key))
        .sort((a, b) => filter.indexOf(a.key) - filter.indexOf(b.key)),
    [achievements, filter],
  );
};

export default function PlayerAchievements({ achievements, summary }: Props) {
  const { t } = useTranslation();

  const oneShot = useFilteredAchievements(achievements, Unique);
  const lifetime = useFilteredAchievements(achievements, Progress);
  const records = useFilteredAchievements(achievements, Records);

  const remaining = achievements.filter(
    (t) =>
      !oneShot.includes(t) && !lifetime.includes(t) && !records.includes(t),
  );

  return (
    <div className={c.playerPage}>
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <EmbedProps
        description={t("achievements_page.seo.description", {
          player: summary.user.name,
        })}
        title={t("achievements_page.seo.title", {
          player: summary.user.name,
        })}
      />
      <QueuePageBlock
        className={c.fullwidth}
        heading={t("achievements_page.header.lifetime")}
      >
        <Panel className={c.achievements}>
          {lifetime.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Panel>
      </QueuePageBlock>

      <QueuePageBlock
        className={c.fullwidth}
        heading={t("achievements_page.header.records")}
      >
        <Panel className={c.achievements}>
          {records.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Panel>
      </QueuePageBlock>

      <QueuePageBlock
        className={c.fullwidth}
        heading={t("achievements_page.header.unique")}
      >
        <Panel className={c.achievements}>
          {oneShot.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Panel>
      </QueuePageBlock>

      {remaining.length > 0 && (
        <QueuePageBlock
          className={c.fullwidth}
          heading={t("achievements_page.header.unique")}
        >
          <Panel className={c.achievements}>
            {remaining
              .sort((a, b) => b.key - a.key)
              .map((t) => (
                <AchievementStatus key={t.key} achievement={t} />
              ))}
          </Panel>
        </QueuePageBlock>
      )}
      <div style={{ marginBottom: 100 }} />
    </div>
  );
}

PlayerAchievements.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  return {
    summary: await getApi().playerApi.playerControllerPlayerSummary(playerId),
    achievements:
      await getApi().playerApi.playerControllerAchievements(playerId),
    playerId,
  };
};
