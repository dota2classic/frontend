import { StaticPageShell } from "@/components/StaticPageShell";
import patchData from "@/const/684d.json";
import { HeroNames } from "@/const/heronames";
import { ItemData } from "@/const/itemdata";
import Image from "next/image";
import styles from "./Changelog.module.scss";
import { Trans, useTranslation } from "react-i18next";

interface Change {
  path: string;
  old: string | null;
  new: string;
}

function getHeroDisplayName(heroKey: string): string {
  const heroEntry = HeroNames.find(
    (h) => h.hero.includes(`_${heroKey}`) || h.hero.endsWith(heroKey),
  );
  return heroEntry?.localizedName || heroKey;
}

function getItemDisplayName(itemKey: string): string {
  const itemEntry = ItemData.find(
    (i) => i.item_name === itemKey || i.item_name === `item_${itemKey}`,
  );
  return itemEntry?.name || itemKey;
}

function getTranslationKey(path: string): string {
  // Handle AbilitySpecial.xxx parameters
  if (path.includes("AbilitySpecial.")) {
    const key = path.replace("AbilitySpecial.", "");
    return `changelog.parameters.AbilitySpecial.${key}`;
  }
  // Direct parameters like AbilityCastRange
  return `changelog.parameters.${path}`;
}

function formatValue(value: string | null): string {
  if (value === null) return "—";
  const parts = value.split(/\s+/).map((part) => {
    const num = parseFloat(part);
    if (!isNaN(num) && Number.isInteger(num)) {
      return String(num);
    }
    return part;
  });

  // If all parts are the same, return just one
  if (parts.length > 1 && parts.every((p) => p === parts[0])) {
    return parts[0];
  }

  return parts.join("/");
}

function ChangelineItem({ change }: { change: Change }) {
  const transKey = getTranslationKey(change.path);
  const oldStr = formatValue(change.old);
  const newStr = formatValue(change.new);

  return (
    <span className={styles.changelineItem}>
      <span className={styles.paramName}>
        <Trans i18nKey={transKey} />
      </span>
      <span className={styles.changeValues}>
        {oldStr} → {newStr}
      </span>
    </span>
  );
}

function formatAbilityName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getAbilityIconPath(heroName: string, abilityName: string): string {
  const iconName = `${heroName}_${abilityName}.webp`;
  return `/spellicons/${iconName}`;
}

function HeroRow({ hero }: { hero: (typeof patchData.heroes)[0] }) {
  const hasChanges = hero.stats.length > 0 || hero.abilities.length > 0;
  if (!hasChanges) return null;

  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <Image
          src={`/heroes/${hero.hero}.webp`}
          alt={hero.hero}
          width={140}
          height={78}
          className={styles.rowImage}
        />
        <h3 className={styles.rowTitle}>
          {getHeroDisplayName(hero.hero).toUpperCase()}
        </h3>
      </div>

      {hero.stats.length > 0 && (
        <ul className={styles.changesList}>
          {hero.stats.map((change, idx) => (
            <li key={idx}>
              <ChangelineItem change={change} />
            </li>
          ))}
        </ul>
      )}

      {hero.abilities.length > 0 && (
        <div className={styles.abilitiesContainer}>
          {hero.abilities.map((ability, idx) => (
            <div key={idx} className={styles.abilityItem}>
              <div className={styles.abilityHeader}>
                <Image
                  src={getAbilityIconPath(hero.hero, ability.name)}
                  alt={ability.name}
                  width={48}
                  height={48}
                  className={styles.abilityIcon}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <h4 className={styles.abilityName}>
                  {formatAbilityName(ability.name)}
                </h4>
              </div>
              <ul className={styles.changesList}>
                {ability.changes.map((change, changeIdx) => (
                  <li key={changeIdx}>
                    <ChangelineItem change={change} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemRow({ item }: { item: (typeof patchData.items)[0] }) {
  const isRecipe = item.item.includes("recipe");
  return (
    <div className={styles.row}>
      <div className={styles.rowHeader}>
        <div style={{ position: "relative", width: 85, height: 64 }}>
          <Image
            src={`/items/${item.item}_lg.webp`}
            alt={item.item}
            width={85}
            height={64}
            className={styles.itemImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {isRecipe && (
            <Image
              src="/items/recipe_lg.webp"
              alt="Recipe"
              width={85}
              height={64}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
        <h3 className={styles.rowTitle}>
          {getItemDisplayName(item.item).toUpperCase()}
        </h3>
      </div>
      <ul className={styles.changesList}>
        {item.changes.map((change, idx) => (
          <li key={idx}>
            <ChangelineItem change={change} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChangelogPage() {
  const { t } = useTranslation();
  const heroesWithChanges = patchData.heroes.filter(
    (h) => h.stats.length > 0 || h.abilities.length > 0,
  );

  return (
    <StaticPageShell
      eyebrow={t("changelog.page.patch_684d.eyebrow")}
      title={t("changelog.page.patch_684d.title")}
      description={
        <Trans
          i18nKey="changelog.page.patch_684d.description"
          components={{ br: <br />, b: <b className="gold" /> }}
        />
      }
      embedTitle={t("changelog.page.patch_684d.embedTitle")}
      embedDescription={t("changelog.page.patch_684d.embedDescription")}
    >
      {heroesWithChanges.length > 0 && (
        <section className={styles.surfaceSection}>
          <div className={styles.surfaceHeader}>
            {t("changelog.page.patch_684d.heroUpdates")}
          </div>
          <div className={styles.surfaceContent}>
            {heroesWithChanges.map((hero) => (
              <HeroRow key={hero.hero} hero={hero} />
            ))}
          </div>
        </section>
      )}

      {patchData.items.length > 0 && (
        <section className={styles.surfaceSection}>
          <div className={styles.surfaceHeader}>
            {t("changelog.page.patch_684d.itemUpdates")}
          </div>
          <div className={styles.surfaceContent}>
            {patchData.items.map((item) => (
              <ItemRow key={item.item} item={item} />
            ))}
          </div>
        </section>
      )}
    </StaticPageShell>
  );
}
