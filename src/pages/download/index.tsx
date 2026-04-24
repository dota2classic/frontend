import React, { useEffect } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { pushFaroEvent } from "@/util/faro";
import { TechStaticTabs } from "@/containers/TechStaticTabs";
import { Trans, TranslationFunction, useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PageLink } from "@/components/PageLink";
import { Button } from "@/components/Button";
import { SectionBlock } from "@/components/SectionBlock";
import { Surface } from "@/components/Surface";
import { StaticPageShell } from "@/components/StaticPageShell";
import { FaWindows } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import c from "./Download.module.scss";

interface Props {
  initialOS: OperatingSystem;
}

const GuideCompact = (t: TranslationFunction) => [
  {
    title: t("download_page.educationTutorial"),
    content: (
      <ol>
        <li>
          <Trans
            i18nKey="download_page.queueBotGame"
            components={{
              queue: <PageLink link={AppRouter.queue.link} className="link" />,
            }}
          />
        </li>
        <li>{t("download_page.configureClientLauncher")}</li>
        <li>{t("download_page.winToUnlockModes")}</li>
      </ol>
    ),
  },
  {
    title: t("download_page.humanGames"),
    content: (
      <>
        <p>
          <Trans
            i18nKey="download_page.congratulations"
            components={{
              mode: <span className="gold" />,
              queue: <PageLink link={AppRouter.queue.link} className="link" />,
            }}
            values={{
              mode: t(
                `matchmaking_mode.${MatchmakingMode.UNRANKED}` as TranslationKey,
              ),
            }}
          />
        </p>
        <Trans
          i18nKey="download_page.learnAbout"
          components={{
            history: (
              <PageLink
                className="link"
                link={AppRouter.matches.index().link}
              />
            ),
            leaderboard: (
              <PageLink
                className="link"
                link={AppRouter.players.leaderboard().link}
              />
            ),
            heroes: (
              <PageLink className="link" link={AppRouter.heroes.index.link} />
            ),
          }}
        />
      </>
    ),
  },
];

export default function DownloadPage({ initialOS }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    pushFaroEvent("download_page_viewed", { os: initialOS });
  }, []);

  return (
    <StaticPageShell
      eyebrow="Getting Started"
      title={t("download_page.howToStartPlaying")}
      description={t("download_page.seo.description")}
      embedTitle={t("download_page.seo.title")}
      embedDescription={t("download_page.seo.description")}
      tabs={<TechStaticTabs />}
    >
      <SectionBlock title={t("download_page.downloadLauncher")}>
        <Surface className={c.downloadCard} padding="lg" variant="raised">
          <p>{t("download_page.launcherDescription")}</p>
          <Button
            mega
            className={c.launcherButton}
            href="https://github.com/dota2classic/launcher/releases/latest/download/d2c-launcher-win-Setup.exe"
            link
            target="_blank"
            onClick={() => pushFaroEvent("download_launcher_clicked")}
          >
            <MdDownload size={28} />
            {t("download_page.launcherButton")}
          </Button>
          <Surface className={c.windowsNote} padding="xs" variant="panel">
            <FaWindows size={16} />
            {t("download_page.launcherWindowsOnly")}
          </Surface>
        </Surface>
      </SectionBlock>
      {GuideCompact(t).map((item, index) => (
        <SectionBlock key={index} title={item.title}>
          <div className={c.stepContent}>{item.content}</div>
        </SectionBlock>
      ))}
    </StaticPageShell>
  );
}

DownloadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  if (ctx.req) {
    const ua = ctx.req.headers["user-agent"];
    return { initialOS: getOSFromHeader(ua || "") };
  } else {
    return {
      initialOS: getOS(),
    };
  }
};
