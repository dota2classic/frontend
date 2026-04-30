// noinspection JSAnnotator

import parse, { DOMNode, Element } from "html-react-parser";
import { ElementType } from "domelementtype";
import React, { useMemo } from "react";
import { ForumUserEmbed } from "../ForumUserEmbed";
import { ForumHeroEmbed } from "../ForumHeroEmbed";
import { ForumItemEmbed } from "../ForumItemEmbed";
import { ChangelogLink } from "../ChangelogLink";

const isPlayerMention = (node: DOMNode): boolean => {
  return (
    node.type === ElementType.Tag &&
    node.name === "a" &&
    !!node.attribs["data-steam_id"]
  );
};

const isHeroMention = (node: DOMNode): boolean => {
  return (
    node.type === ElementType.Tag &&
    node.name === "a" &&
    !!node.attribs["data-hero_id"]
  );
};

const isItemMention = (node: DOMNode): boolean => {
  return (
    node.type === ElementType.Tag &&
    node.name === "a" &&
    !!node.attribs["data-item_id"]
  );
};

const isChangelogEmbed = (node: DOMNode): boolean => {
  if (node.type !== ElementType.Text) return false;
  return typeof node.data === "string" && node.data.includes("[changelog:");
};

const enrichPost = (html: string) => {
  return parse(html, {
    replace(domNode) {
      if (domNode instanceof Element) {
        if (isPlayerMention(domNode)) {
          return <ForumUserEmbed steamId={domNode.attribs["data-steam_id"]} />;
        } else if (isHeroMention(domNode)) {
          return <ForumHeroEmbed hero={domNode.attribs["data-hero_id"]} />;
        } else if (isItemMention(domNode)) {
          return (
            <ForumItemEmbed itemId={Number(domNode.attribs["data-item_id"])} />
          );
        }
      } else if (isChangelogEmbed(domNode)) {
        const text = domNode.data as string;
        const match = text.match(/\[changelog:([^\]]+)\]/);
        if (match) {
          const patch = match[1];
          const before = text.substring(0, match.index);
          const after = text.substring(match.index! + match[0].length);
          return (
            <>
              {before}
              <ChangelogLink patch={patch} />
              {after}
            </>
          );
        }
      }
    },
  });
};

export const useEnrichedPostContent = (html: string) => {
  return useMemo(() => enrichPost(html), [html]);
};
