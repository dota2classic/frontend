import { MatchDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Button, CoolList, CopyBlock, MatchSummary } from "@/components";
import { Rubik } from "next/font/google";
import cx from "clsx";
import { metrika } from "@/ym";
import { NextPageContext } from "next";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface MatchDownloadPage {
  match?: MatchDto;
}
export default function MatchDownloadPage({ match }: MatchDownloadPage) {
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
            title: <>Скачай реплей</>,
            content: (
              <>
                <Button
                  link
                  href={match.replayUrl}
                  target="__blank"
                  onClick={() => metrika("reachGoal", "DOWNLOAD_REPLAY")}
                >
                  Нажми сюда, чтобы скачать файл с реплеем игры
                </Button>
              </>
            ),
          },
          {
            title: <>Помести скачанный файл в папку с игрой</>,
            content: (
              <>
                <p className={cx("gold", threadFont.className)}>
                  папка с игрой/dota
                </p>
                Если такой папки нет - создай. <br />
                Итог: у тебя должен быть файл{" "}
                <span className={cx("green", threadFont.className)}>
                  dota/{match.id}.dem
                </span>
                <img src="/guide/replay-folder.png" alt="" />
              </>
            ),
          },
          {
            title: <>Запусти клиент и выполни коснольную команду</>,
            content: (
              <>
                <CopyBlock
                  text={"Консольная команда для запуска просмотра реплея"}
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
