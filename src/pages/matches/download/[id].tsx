import { MatchDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Button, CoolList, CopyBlock, MatchSummary } from "@/components";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { metrika } from "@/ym";
import { NextPageContext } from "next";
import { useTranslation } from 'react-i18next';

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

  return (
    <div>
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
                  href={match.replayUrl}
                  target="__blank"
                  onClick={() => metrika("reachGoal", "DOWNLOAD_REPLAY")}
                >
                  {t("match_download.downloadReplayButton")}
                </Button>
              </>
            ),
          },
          {
            title: <> {t("match_download.placeFileTitle")} </>,
            content: (
              <> 
                <p className={cx("gold", threadFont.className)}>
                  {t("match_download.gameFolder")}
                </p>
                {t("match_download.createFolder")}. <br />
                {t("match_download.finalFile")}
                <span className={cx("green", threadFont.className)}>
                  {t("match_download.finalFilePath", { matchId: match.id })}
                </span>
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