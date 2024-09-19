const commit = `563b88615b971078d786d5c653dfd7238b3b7a40`;
const itemsJsonUrl = `https://github.com/dotabuff/d2vpkr/raw/${commit}/dota/scripts/npc/items.json`;
const abilitiesJsonUrl = `https://raw.githubusercontent.com/dotabuff/d2vpkr/${commit}/dota/resource/dota_russian.json`;

const fs = require("fs").promises;

async function downloadFiles() {
  await fs.writeFile(
    "./abilities.json",
    JSON.stringify(
      await fetch(abilitiesJsonUrl).then((it) => it.json()),
      null,
      2,
    ),
  );

  await fs.writeFile(
    "./items.json",
    JSON.stringify(await fetch(itemsJsonUrl).then((it) => it.json()), null, 2),
  );
}

async function createItemDescriptions() {
  const abilities = JSON.parse(
    await fs.readFile("./abilities.json").then((it) => it.toString()),
  ).lang.Tokens;
  const items = JSON.parse(
    await fs.readFile("./items.json").then((it) => it.toString()),
  );

  let entries = Object.entries(items.DOTAAbilities).filter(
    (it) => it[0] !== "Version",
  );

  const tmp = {
    // blink_damage_cooldown: "",
    // blink_range_clamp: "",
    bonus_health_regen: "Регенерация здоровья",
    bonus_mana_regen: "Регенерация маны",
    bonus_movement_speed: "Скорость передвижения",
    bonus_magical_armor: "Сопротивление магии",
    // tooltip_resist: "",
    bonus_evasion: "Уклонение",
    max_charges: "Зарядов",
    // charge_radius: "",
    hp_regen: "Регенерация здоровья",
    movement_speed_percent_bonus: "Скорость передвижения%",
    lifetime: "Длительность",
    health: "Здоровье",
    // vision_range: "",
    bonus_health: "Здоровье",
    // observer_cost: "Стоимость ",
    // sentry_cost: "",
    // lifetime_observer: "",
    // lifetime_sentry: "",
    // creation_delay: "",
    minimun_distance: "Минимальная дистанция",
    maximum_distance: "Максимальная дистанция",
    vision_radius: "Радиус обзора",
    bonus_mana: "Мана",
    bonus_stat: "Атрибуты",
    xp_multiplier: "Множитель опыта",
    bonus_gold: "Дополнительное золото",
    block_chance_hero: "Шанс блока против героев",
    aura_radius: "Радиус ауры",
    bonus_aoe_armor: "Аура: броня",
    bonus_aoe_duration: "Аура: длительность",
    bonus_aoe_duration_hero: "Аура: длительность на герояъ",
    health_regen: "Регенерация здоровья",
    magic_resistance: "Сопротивления магии",
    barrier_debuff_duration: "Длительность эффекта",
    // barrier_block_creep: "",
    mana_regen: "Регенерация маны",
    soul_radius: "Радиус",
    soul_initial_charge: "Зарядов изначально",
    soul_additional_charges: "Зарядов за убийство",
    // soul_heal_interval: "",
    soul_damage_duration: "Длительность",
    sheep_movement_speed: "Скорость передвижения",
    // cast_range_tooltip: "",
    push_length: "Дальность толчка",
    // damage_delay: "",
    summon_duration: "Длительность призыва",
    warrior_mana_feedback: "Выжигание маны",
    warrior_truesight: "Truesight",
    archer_attack_speed_radius: "Лучник: аура скорости атаки",
    // archer_aura_radius_tooltip: "",
    cooldown_melee: "Перезарядка(ближний)",
    cooldown_ranged_tooltip: "Перезарядка(дальний)",
    // max_level: "Максимальный уровень",
    // model_scale: "",
    // reincarnate_time: "",
    // disappear_time: "",
    // disappear_time_minutes_tooltip: "",
    // blast_speed: "",
    charge_range: "Радиус получения заряда",
    heal_on_death_range: "Радиус лечения при смерти",
    heal_on_death_base: "Базовое лечение",
    heal_on_death_per_charge: "Лечение за заряд",
    respawn_time_reduction: "Уменьшение времени возрождения за заряд",
    // death_gold_reduction: "",
    // on_death_removal: "",
    block_cooldown: "Перезарядка",
    // block_damage_ranged_active: "",
    block_chance_active: "Шанс блока",
    bonus_spell_resist: "Сопротивление магии",
    bash_stun: "Длительность оглушения",
    bash_cooldown: "Перезарядка оглушения",
    cleave_radius: "Радиус прорубания",
    // images_do_damage_percent_melee: "Урон иллюзий(ближний)",
    // images_take_damage_percent_melee: "Урон по иллюзиям(ближний)",
    // images_do_damage_percent_ranged: "Урон иллюзий(дальний)",
    // images_take_damage_percent_ranged: "Урон по иллюзиям(дальний)",
    // invuln_duration: "Длительность неуязвимости",
    unholy_bonus_damage: "Урон",
    unholy_bonus_attack_speed: "Скорость атаки",
    unholy_bonus_strength: "Сила",
    // unholy_health_drain_per_tick: "",
    unholy_health_drain_per_second_tooltip: "Потеря здоровья",
    toggle_cooldown: "Перезарядка",
    windwalk_movement_speed: "Скорость передвижения",
    // windwalk_fade_time: "",
    // backstab_slow: "",
    backstab_duration_range: "Длительность эффектка",
    unholy_lifesteal_percent: "Процент вампиризма",
    static_strikes: "Отскоков",
    static_primary_radius: "Радиус отскока",
    // static_seconary_radius: "",
    static_cooldown: "Перезарядка отскока",
    // chain_delay: "",
    // chain_cooldown: "",
    // dominate_duration: "",
    health_min: "Минимальное здоровье",
    corruption_duration: "Длительность эффекта",
    initial_charges: "Зарядов",
    feedback_mana_burn: "Маны выжжено(ближний)",
    feedback_mana_burn_ranged: "Маны выжжено(дальний)",
    // purge_summoned_damage: "",
    // purge_rate: "",
    // purge_root_duration: "",
    damage_per_burn: "Урон за сожженную ману",
    blast_agility_multiplier: "Множитель урона от ловкости",
    blast_damage_base: "Базовый урон",
    projectile_speed: "Скорость снаряда",
    health_sacrifice: "Здоровья жертвуется",
    mana_gain: "Маны получается",
    bonus_movement: "Скорость передвижения",
    bonus_intelligence: "Интеллект",
    // active_duration: "",
    bonus_stats: "Атрибуты",
    bonus_mana_regen_pct: "bonus_mana_regen_pct",
    // enemy_armor_reduction_tooltip: "",
    // application_radius: "",
    // visibility_radius: "",
    heal_duration: "Длительность лечения",
    heal_amount: "Лечение",
    // heal_interval: "",
    // break_time: "",
    // break_count: "",
    // break_threshold: "",
    broken_movement_speed: "Скорость передвижения(сломанные)",
    hook_speed: "Скорость крюка",
    hook_width: "hook_width",
    hook_distance: "Дальность крюка",
    // vision_duration: "",
    arrow_speed: "arrow_speed",
    arrow_width: "arrow_width",
    arrow_range: "arrow_range",
    arrow_max_stunrange: "arrow_max_stunrange",
    arrow_min_stun: "Минимальное оглушение",
    arrow_max_stun: "Максимальное оглушение",
    stun_duration: "Длительность оглушения",
    attack_speed_bonus_pct: "attack_speed_bonus_pct",
    min_damage: "Минимальный урон",
    max_distance: "Максимальное расстояние",
    pre_flight_time: "pre_flight_time",
    hero_damage: "Урон по героям",
    speed: "Скорость",
    acceleration: "acceleration",
    enemy_vision_time: "enemy_vision_time",
    duration: "Длительность",
    grab_radius: "grab_radius",
    radius: "Радиус",
    bonus_damage_pct: "bonus_damage_pct",
    grow_bonus_damage_pct: "grow_bonus_damage_pct",
    tooltip_range: "Радиус",
    toss_damage: "Урон от броска",
    damage: "Урон",
    radius_tree: "Радиус",
    transform_duration: "Длительность",
    buff_duration: "Длительность",
    total_health: "Здоровье",
    total_mana: "Мана",
  };

  const locParameters = {
    bonus_speed: "Скорость атаки",
    bonus_attack_speed: "Скорость атаки",
    bonus_damage: "Урон",
    bonus_armor: "Броня",
    bonus_regen: "Регенерация здоровья",
    blink_range: "Дальность телепортации",

    bonus_strength: "Сила",
    bonus_agility: "Ловкость",
    bonus_intellect: "Интеллект",
    bonus_all_stats: "Атрибуты",

    ...tmp,
  };

  const missedKeys = new Set();

  // entries = entries.slice(89, 90);

  const something = entries.map(([item_name, item_data], idx) => {
    const isRecipe = item_data.ItemRecipe === "1";

    let locName = abilities[`DOTA_Tooltip_Ability_${item_name}`];

    if (isRecipe) {
      locName = `Рецепт ${abilities[`DOTA_Tooltip_Ability_${item_name.replace("_recipe", "")}`]}`;
    }

    const specials = (item_data["AbilitySpecial"] || [])
      .map((it) => {
        const key = Object.keys(it)[0];
        const value = it[key];

        const ak = `DOTA_Tooltip_ability_${item_name}_${key}`;
        let locSpecial = abilities[ak] || key;

        const hasLocalisation = ak in abilities;

        const r = new RegExp(`\\$([a-zA-Z0-9_]+)`, "g");

        const isPercent = locSpecial.startsWith("%");

        if (isPercent) {
          locSpecial = locSpecial.slice(1);
        }

        Array.from(locSpecial.matchAll(r)).forEach((matches) => {
          locSpecial = `${locSpecial.replace(matches[0], value)}`;
        });

        if (locSpecial === key) {
          locSpecial = value.toString();
        }

        const hasKey = key in locParameters;

        // console.log(`Special ${key} -> ${value}`);
        // console.log(
        //   hasLocalisation,
        //   hasKey,
        //   locSpecial,
        //   locSpecial.startsWith("+"),
        // );

        if (hasLocalisation && !locSpecial.startsWith("+")) {
          locSpecial = `${locSpecial} ${value}${isPercent ? "%" : ""}`;
        }
        if (!hasKey && !hasLocalisation) {
          missedKeys.add(key);
          return null;
        } else if (hasKey && (!hasLocalisation || locSpecial.startsWith("+"))) {
          locSpecial = `${locParameters[key] || `missing_key [${key}]`}: ${locSpecial}`;
        }

        return locSpecial.toLowerCase();
        // return locSpecial.toUpperCase();
      })
      .filter(Boolean);

    const notes = new Array(10)
      .fill(null)
      .map((_, index) => `DOTA_Tooltip_ability_${item_name}_Note${index}`)
      .map((it) => abilities[it])
      .filter(Boolean);

    let description = (
      abilities[`DOTA_Tooltip_ability_${item_name}_Description`] || ""
    ).replaceAll("\\n", "\n");

    const r2 = new RegExp(`%([a-zA-Z0-9_]+)%`, "g");

    const matches = Array.from(description.matchAll(r2));

    matches.forEach((m) => {
      const some = (item_data["AbilitySpecial"] || []).find(
        (t) => Object.keys(t)[0] === m[1],
      );
      if (!some) {
        console.warn(`Did not find replace key for`, m);
        console.warn(description);
      } else
        description = description.replace(m[0], Object.entries(some)[0][1]);
    });

    return {
      idx,
      item_name: item_name,
      description,
      name: locName || item_name,
      specials: specials,
      cooldown: Number(item_data.AbilityCooldown) || undefined,
      cost: Number(item_data.ItemCost),
      recipe: isRecipe,
      notes,
    };
  });

  await fs.writeFile(
    "../src/const/itemdata.ts",
    `export const ItemData = ${JSON.stringify(something, null, 2)};
  export type ItemKey = ${something.map((it) => `'${it.item_name}'`).join(" | ")};`,
  );

  console.log(`Missed keys:`);
  console.log(
    JSON.stringify(
      Object.fromEntries(Array.from(missedKeys).map((it) => [it, ""])),
    ),
  );
}

createItemDescriptions();
