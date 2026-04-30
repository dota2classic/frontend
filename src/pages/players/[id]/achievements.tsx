import { NextPageContext } from "next";
import React, { useMemo } from "react";
import { AchievementDto, AchievementKey, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";
import { PlayerSummary } from "@/components/PlayerSummary";
import { AchievementStatus } from "@/components/AchievementStatus";
import c from "@/pages/players/[id]/PlayerPage.module.scss";
import { EmbedProps } from "@/components/EmbedProps";
import { SectionBlock } from "@/components/SectionBlock";
import { Surface } from "@/components/Surface";

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
      <SectionBlock
        className={c.fullwidth}
        title={t("achievements_page.header.lifetime")}
      >
        <Surface className={c.achievements} padding="xs" variant="panel">
          {lifetime.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Surface>
      </SectionBlock>

      <SectionBlock
        className={c.fullwidth}
        title={t("achievements_page.header.records")}
      >
        <Surface className={c.achievements} padding="xs" variant="panel">
          {records.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Surface>
      </SectionBlock>

      <SectionBlock
        className={c.fullwidth}
        title={t("achievements_page.header.unique")}
      >
        <Surface className={c.achievements} padding="xs" variant="panel">
          {oneShot.map((t) => (
            <AchievementStatus key={t.key} achievement={t} />
          ))}
        </Surface>
      </SectionBlock>

      {remaining.length > 0 && (
        <SectionBlock
          className={c.fullwidth}
          title={t("achievements_page.header.unique")}
        >
          <Surface className={c.achievements} padding="xs" variant="panel">
            {remaining
              .sort((a, b) => b.key - a.key)
              .map((t) => (
                <AchievementStatus key={t.key} achievement={t} />
              ))}
          </Surface>
        </SectionBlock>
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
