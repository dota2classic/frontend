import React, { useEffect } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { pushFaroEvent } from "@/util/faro";
import { Trans, useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PageLink } from "@/components/PageLink";
import { Button } from "@/components/Button";
import { StaticPageShell } from "@/components/StaticPageShell";
import { Surface } from "@/components/Surface";
import { DiscordInvite, TelegramInvite } from "@/components/TelegramInvite";
import c from "./Download.module.scss";

interface Props {
  initialOS: OperatingSystem;
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

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
      pageClassName={c.page}
      heroClassName={c.hero}
      className={c.shell}
      contentClassName={c.content}
    >
      <div className={c.steps}>
        <Surface className={c.stepCard} padding="lg" variant="raised">
          <div className={c.stepHeader}>
            <span className={c.stepNumber}>1</span>
            <div className={c.stepMain}>
              <h2 className={c.stepTitle}>{t("download_page.downloadLauncher")}</h2>
              <p className={c.stepLead}>{t("download_page.launcherDescription")}</p>
            </div>
          </div>

          <div className={c.stepBody}>
            <Button
              className={c.primaryCta}
              link
              href="https://github.com/dota2classic/launcher/releases/latest/download/d2c-launcher-win-Setup.exe"
              target="_blank"
              variant="landingPrimary"
              onClick={() => pushFaroEvent("download_launcher_clicked")}
            >
              <DownloadIcon />
              {t("download_page.launcherButton")}
            </Button>
          </div>
        </Surface>

        <Surface className={c.stepCard} padding="lg" variant="raised">
          <div className={c.stepHeader}>
            <span className={c.stepNumber}>2</span>
            <div className={c.stepMain}>
              <h2 className={c.stepTitle}>{t("download_page.educationTutorial")}</h2>
              <p className={c.stepLead}>{t("download_page.passTraining")}</p>
            </div>
          </div>

          <div className={c.stepBody}>
            <ol className={c.stepList}>
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

            <p className={c.supportText}>
              <Trans
                i18nKey="download_page.downloadingGame"
                components={{
                  telegram: <TelegramInvite className={c.telegramLink} />,
                  discord: <DiscordInvite className={c.discordLink} />,
                }}
              />
            </p>
          </div>
        </Surface>

        <Surface className={c.stepCard} padding="lg" variant="raised">
          <div className={c.stepHeader}>
            <span className={c.stepNumber}>3</span>
            <div className={c.stepMain}>
              <h2 className={c.stepTitle}>{t("download_page.humanGames")}</h2>
              <p className={c.stepLead}>
                <Trans
                  i18nKey="download_page.congratulations"
                  components={{
                    mode: <span className={c.highlight} />,
                    queue: <PageLink link={AppRouter.queue.link} className="link" />,
                  }}
                  values={{
                    mode: t(
                      `matchmaking_mode.${MatchmakingMode.UNRANKED}` as TranslationKey,
                    ),
                  }}
                />
              </p>
            </div>
          </div>

          <div className={c.stepBody}>
            <p className={c.linksRow}>
              <Trans
                i18nKey="download_page.learnAbout"
                components={{
                  history: (
                    <PageLink className="link" link={AppRouter.matches.index().link} />
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
            </p>
          </div>
        </Surface>
      </div>
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
