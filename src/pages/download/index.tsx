import React, { useEffect } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { pushFaroEvent } from "@/util/faro";
import { NotoSans } from "@/const/notosans";
import { TechStaticTabs } from "@/containers/TechStaticTabs";
import { Trans, TranslationFunction, useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PageLink } from "@/components/PageLink";
import { EmbedProps } from "@/components/EmbedProps";
import { CoolList } from "@/components/CoolList";
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

  const coolListContent = [
    {
      title: t("download_page.downloadLauncher"),
      content: (
        <>
          <p>{t("download_page.launcherDescription")}</p>
          <p>
            <a
              href="https://github.com/dota2classic/launcher/releases/latest/download/d2c-launcher-win-Setup.exe"
              target="_blank"
              rel="noopener noreferrer"
              className={c.launcherButton}
              onClick={() => pushFaroEvent("download_launcher_clicked")}
            >
              <MdDownload size={28} />
              {t("download_page.launcherButton")}
            </a>
          </p>
          <p>
            <span className={c.windowsNote}>
              <FaWindows size={16} />
              {t("download_page.launcherWindowsOnly")}
            </span>
          </p>
        </>
      ),
    },
    ...GuideCompact(t),
  ];
  return (
    <div className={NotoSans.className}>
      <EmbedProps
        title={t("download_page.seo.title")}
        description={t("download_page.seo.description")}
      />
      <TechStaticTabs />
      <h1 style={{ textAlign: "center" }}>
        {t("download_page.howToStartPlaying")}
      </h1>
      <CoolList items={coolListContent} />
    </div>
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
