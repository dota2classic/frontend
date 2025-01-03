import React, { ReactNode } from "react";
import { Emoticon, ForumUserEmbed, PageLink } from "@/components";
import { AppRouter } from "@/route";
import { youtubeVideo } from "@/util";
import c from "./RichMessage.module.scss";

interface IRichMessageProps {
  rawMsg: string;
}

export const RichMessage = React.memo(function RichMessage({
  rawMsg,
}: IRichMessageProps) {
  const msg = rawMsg.replace(/\n\s*\n/g, "\n");

  const parts: ReactNode[] = [];
  const r = new RegExp(
    `(https:\\/\\/dotaclassic.ru\\/matches\\/(\\d+))|(https:\\/\\/dotaclassic.ru\\/players\\/(\\d+))|(https?:\\/\\/([\\S]+)\\.[\\S]+)|(:[a-zA-Z_0-9]+:)`,
    "g",
  );
  const matches = Array.from(msg.matchAll(r));

  let prevIdx = 0;
  matches.forEach((match) => {
    const prev = msg.slice(prevIdx, match.index);

    parts.push(prev);

    const atIndex = match.index;

    const key = `elem-${atIndex}`;

    if (match[4]) {
      // player
      // somehow fetch user?
      const playerId = match[4];
      parts.push(<ForumUserEmbed key={key} steamId={playerId} />);
    } else if (match[5]) {
      const domain = match[6];

      const videoId = youtubeVideo(match[5]);

      if ((domain === "youtube" || domain === "www.youtube") && videoId) {
        // we can try to embed it
        parts.push(
          <iframe
            key={key}
            className={c.iframe}
            src={`https://www.youtube.com/embed/${videoId}`}
          ></iframe>,
        );
      } else {
        // Can we embed it?
        // regular link
        parts.push(
          <a key={key} className="link" href={match[5]} target="__blank">
            {match[5]}
          </a>,
        );
      }
    } else if (match[7]) {
      const emoticonCode = match[7].replaceAll(":", "");

      parts.push(<Emoticon key={key} code={emoticonCode} />);
    } else {
      // match
      const matchId = match[2];
      parts.push(
        <PageLink
          key={key}
          className="link"
          link={AppRouter.matches.match(Number(matchId)).link}
        >
          Матч {matchId}
        </PageLink>,
      );
    }

    prevIdx = atIndex + match[0].length;
  });

  parts.push(msg.slice(prevIdx));

  return <>{parts}</>;
});
