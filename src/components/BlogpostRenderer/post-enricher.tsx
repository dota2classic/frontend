// noinspection JSAnnotator

import parse, { DOMNode, Element } from "html-react-parser";
import { ElementType } from "domelementtype";
import { ForumHeroEmbed, ForumItemEmbed, ForumUserEmbed } from "@/components";
import React, { useMemo } from "react";

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

const enrichPost = (html: string) => {
  return parse(html, {
    replace(domNode) {
      if (!(domNode instanceof Element)) return;

      if (isPlayerMention(domNode)) {
        return <ForumUserEmbed steamId={domNode.attribs["data-steam_id"]} />;
      } else if (isHeroMention(domNode)) {
        return <ForumHeroEmbed hero={domNode.attribs["data-hero_id"]} />;
      } else if (isItemMention(domNode)) {
        return (
          <ForumItemEmbed itemId={Number(domNode.attribs["data-item_id"])} />
        );
      }
    },
  });
};

export const useEnrichedPostContent = (html: string) => {
  return useMemo(() => enrichPost(html), [html]);
};
