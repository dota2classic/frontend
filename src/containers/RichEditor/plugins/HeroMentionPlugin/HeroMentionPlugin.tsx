import GenericMentionPlugin from "@/containers/RichEditor/plugins/GenericMentionPlugin/GenericMentionPlugin";
import { HeroName, HeroNames } from "@/const/heronames";
import React, { useCallback } from "react";
import c from "./HeroMentionPlugin.module.scss";
import { HeroIcon } from "@/components";
import { $createHeroMentionNode } from "@/containers/RichEditor/plugins/HeroMentionPlugin/HeroMentionNode";

const HeroRender = ({ hero, localizedName }: HeroName) => {
  return (
    <div className={c.heroEmbed}>
      <HeroIcon small hero={hero} />
      <span>{localizedName}</span>
    </div>
  );
};

export default function HeroMentionPlugin() {
  const searchHero = useCallback(async (s: string) => {
    return HeroNames.filter(
      ({ hero, localizedName }) =>
        hero.toLowerCase().includes(s) ||
        localizedName.toLowerCase().includes(s),
    );
  }, []);
  return (
    <GenericMentionPlugin<HeroName>
      trigger="!"
      suggestionLimit={20}
      searchProvider={searchHero}
      keyProvider={(t) => t.hero}
      RenderListItem={({ option }) => (
        <HeroRender hero={option.hero} localizedName={option.localizedName} />
      )}
      $createNode={(t) => $createHeroMentionNode(t.hero)}
    />
  );
}
