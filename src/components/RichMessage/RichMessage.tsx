import React from "react";
import { AppRouter } from "@/route";
import { ForumUsername } from "@/components/ForumUserEmbed/ForumUsername";
import c from "./RichMessage.module.scss";
import cx from "clsx";
import { Trans } from "react-i18next";
import { PageLink } from "../PageLink";
import { ForumUserEmbed } from "../ForumUserEmbed";
import { Emoticon } from "../Emoticon";

interface IRichMessageProps {
  rawMsg: string;
}

type Rule = {
  regex: RegExp;
  render: (match: string, index: number) => React.ReactNode;
};

const rules: Rule[] = [
  // https://dotaclassic.ru/players/:steamId/matches
  {
    regex: /https?:\/\/dotaclassic\.ru\/players\/(\d+)\/matches/g,
    render: (match, i) => {
      const steamId = match.match(/players\/(\d+)/)?.[1];
      return (
        <PageLink
          className="link"
          link={AppRouter.players.playerMatches(steamId!).link}
          key={`matches-${i}`}
        >
          <Trans
            i18nKey="rich_message.player_matches"
            components={{
              username: <ForumUsername steamId={steamId!} />,
            }}
          />
        </PageLink>
      );
    },
  },
  // https://dotaclassic.ru/players/:steamId/records
  {
    regex: /https?:\/\/dotaclassic\.ru\/players\/(\d+)\/records/g,
    render: (match, i) => {
      const steamId = match.match(/players\/(\d+)/)?.[1];
      return (
        <PageLink
          className="link"
          link={AppRouter.players.player.records(steamId!).link}
          key={`records-${i}`}
        >
          <Trans
            i18nKey="rich_message.player_records"
            components={{
              username: <ForumUsername steamId={steamId!} />,
            }}
          />
        </PageLink>
      );
    },
  },
  // https://dotaclassic.ru/players/:steamId/heroes
  {
    regex: /https?:\/\/dotaclassic\.ru\/players\/(\d+)\/heroes/g,
    render: (match, i) => {
      const steamId = match.match(/players\/(\d+)/)?.[1];
      return (
        <PageLink
          className="link"
          link={AppRouter.players.player.heroes(steamId!).link}
          key={`heroes-${i}`}
        >
          <Trans
            i18nKey="rich_message.player_heroes"
            components={{
              username: <ForumUsername steamId={steamId!} />,
            }}
          />
        </PageLink>
      );
    },
  },
  // https://dotaclassic.ru/players/:steamId/teammates
  {
    regex: /https?:\/\/dotaclassic\.ru\/players\/(\d+)\/teammates/g,
    render: (match, i) => {
      const steamId = match.match(/players\/(\d+)/)?.[1];
      return (
        <PageLink
          className="link"
          link={AppRouter.players.player.teammates(steamId!).link}
          key={`teammates-${i}`}
        >
          <Trans
            i18nKey="rich_message.player_teammates"
            components={{
              username: <ForumUsername steamId={steamId!} />,
            }}
          />
        </PageLink>
      );
    },
  },
  // https://dotaclassic.ru/matches/:matchId
  {
    regex: /https?:\/\/dotaclassic\.ru\/matches\/(\d+)/g,
    render: (match, i) => {
      const matchId = Number(match.match(/matches\/(\d+)/)?.[1]);
      return (
        <PageLink
          className="link"
          key={`match-${i}`}
          link={AppRouter.matches.match(matchId).link}
        >
          <Trans
            i18nKey="rich_message.match"
            values={{
              matchId,
            }}
          />
        </PageLink>
      );
    },
  },
  // https://dotaclassic.ru/players/:steamId
  {
    regex: /https?:\/\/dotaclassic\.ru\/players\/(\d+)(?:\/)?/g,
    render: (match, i) => {
      const steamId = match.match(/players\/(\d+)/)?.[1];
      return <ForumUserEmbed key={`user-${i}`} steamId={steamId!} />;
    },
  },
  // image URLs
  {
    regex: /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif))/g,
    render: (match, i) => (
      <img
        loading="lazy"
        key={`img-${i}`}
        src={match}
        alt=""
        className={c.embedImage}
      />
    ),
  },
  // basic tags: <rare>...</rare>, <uncommon>...</uncommon>, etc.
  {
    regex:
      /<(common|uncommon|rare|mythical|immortal|legendary|arcana|ancient)>(.*?)<\/\1>/gis,
    render: (match, i) => {
      const [, tag, content] = match.match(
        /<(common|uncommon|rare|mythical|immortal|legendary|arcana|ancient)>(.*?)<\/\1>/is,
      )!;
      const capitalizedTag = tag[0].toUpperCase() + tag.slice(1);
      return (
        <span key={`tag-${i}`} className={cx("rarity", capitalizedTag)}>
          {content}
        </span>
      );
    },
  },
  // emoticons :code:
  {
    regex: /:([a-zA-Z0-9_+-]+):/g,
    render: (match, i) => {
      const code = match.slice(1, -1); // remove surrounding :
      return <Emoticon key={`emote-${i}`} code={code} />;
    },
  },
  // generic URLs (processed last)
  {
    regex: /(https?:\/\/[^\s]+)/g,
    render: (match, i) => (
      <a
        key={`link-${i}`}
        href={match}
        className="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {match}
      </a>
    ),
  },
];

export const RichMessage = React.memo(function RichMessage({
  rawMsg,
}: IRichMessageProps) {
  const msg = rawMsg
    .replace(/\n\s*\n/g, "\n")
    .replace(/\[([^\[\]]*)\]\((.*?)\)/gm, "$2"); // replace markdown links with just links

  let elements: React.ReactNode[] = [msg];

  rules.forEach((rule) => {
    const newElements: React.ReactNode[] = [];

    elements.forEach((el) => {
      try {
        if (typeof el === "string") {
          let lastIndex = 0;
          const matches = [...el.matchAll(rule.regex)];
          if (matches.length === 0) {
            newElements.push(el);
            return;
          }

          matches.forEach((m, i) => {
            const matchStart = m.index ?? 0;
            if (matchStart > lastIndex) {
              newElements.push(el.slice(lastIndex, matchStart));
            }
            newElements.push(rule.render(m[0], i));
            lastIndex = matchStart + m[0].length;
          });

          if (lastIndex < el.length) {
            newElements.push(el.slice(lastIndex));
          }
        } else {
          newElements.push(el);
        }
      } catch (e) {
        console.error(e);
      }
    });

    elements = newElements;
  });

  return elements;
});
