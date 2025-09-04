import { MatchDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { metrika } from "@/ym";
import { NextPageContext } from "next";
import { Trans, useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { MatchSummary } from "@/components/MatchSummary";
import { CoolList } from "@/components/CoolList";
import { Button } from "@/components/Button";
import { CopyBlock } from "@/components/CopyBlock";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface MatchDownloadPage {
  match?: MatchDto;
}
export default function MatchDownloadPage({ match }: MatchDownloadPage) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!match) {
      notFound();
    }
  }, [match]);

  if (!match) return;

  const isZippedReplay =
    new Date(match.timestamp).getTime() >
    new Date("2025-09-01T00:00:59.369Z").getTime();
  return (
    <div>
      <EmbedProps
        title={t("match_download.seo.title", { matchId: match.id })}
        description={t("match_download.seo.description", { matchId: match.id })}
      />
      <MatchSummary
        radiantKills={match.radiant.reduce((a, b) => a + b.kills, 0)}
        direKills={match.dire.reduce((a, b) => a + b.kills, 0)}
        winner={match.winner}
        matchId={match.id}
        duration={match.duration}
        timestamp={match.timestamp}
        mode={match.mode}
        gameMode={match.gameMode}
        replay={match.replayUrl}
      />

      <CoolList
        items={[
          {
            title: <> {t("match_download.downloadReplayTitle")} </>,
            content: (
              <>
                <Button
                  link
                  href={
                    isZippedReplay ? match.replayUrl + ".zip" : match.replayUrl
                  }
                  target="__blank"
                  onClick={() => metrika("reachGoal", "DOWNLOAD_REPLAY")}
                >
                  {t("match_download.downloadReplayButton")}
                </Button>
              </>
            ),
          },
          ...(isZippedReplay
            ? [
                {
                  title: <>{t("match_download.extractZip")}</>,
                  content: <p>{t("match_download.extractZipDescription")}</p>,
                },
              ]
            : []),
          {
            title: <> {t("match_download.placeFileTitle")} </>,
            content: (
              <>
                <p className={cx("gold", threadFont.className)}>
                  {t("match_download.gameFolder")}
                </p>
                {t("match_download.createFolder")}
                <br />
                <Trans
                  i18nKey="match_download.finalFile"
                  values={{
                    matchId: match.id,
                  }}
                  components={{
                    attention: <span className={cx("green")} />,
                  }}
                />
                <img src="/guide/replay-folder.png" alt="" />
              </>
            ),
          },
          {
            title: <> {t("match_download.startClientTitle")} </>,
            content: (
              <>
                <CopyBlock
                  text={t("match_download.consoleCommandText")}
                  command={`playdemo ${match.id}.dem`}
                />
                <img src="/guide/replay-console-command.png" alt="" />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

MatchDownloadPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<MatchDownloadPage> => {
  const matchId = parseInt(ctx.query.id as string);

  const m = await getApi()
    .matchApi.matchControllerMatch(matchId)
    .catch(() => undefined);
  return {
    match: m,
  };
};
