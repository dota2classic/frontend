import GenericMentionPlugin from "../GenericMentionPlugin/GenericMentionPlugin";
import { HeroName, HeroNames } from "@/const/heronames";
import React, { useCallback } from "react";
import c from "./HeroMentionPlugin.module.scss";
import { HeroIcon } from "@/components/HeroIcon";
import { $createHeroMentionNode } from "./HeroMentionNode";
import { useTranslation } from "react-i18next";

const HeroRender = ({ hero, localizedName }: HeroName) => {
  return (
    <div className={c.heroEmbed}>
      <HeroIcon small hero={hero} />
      <span>{localizedName}</span>
    </div>
  );
};

export default function HeroMentionPlugin() {
  const { t } = useTranslation();
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
        <HeroRender
          hero={option.hero}
          localizedName={t("hero_mention.localizedName", {
            name: option.localizedName,
          })}
        />
      )}
      $createNode={(t) => $createHeroMentionNode(t.hero)}
    />
  );
}
