export const ItemData = [
  {
    idx: 0,
    item_name: "item_blink",
    description:
      "Активируемая: Blink — телепортирует к указанной точке на расстоянии до 1200 единиц. Если вы получите урон, то не сможете использовать Blink Dagger в течение 3 сек.",
    name: "Blink Dagger",
    specials: ["дальность телепортации: 1200"],
    cooldown: 12,
    cost: 2250,
    recipe: false,
    notes: [
      "Применение на себя переместит вас в сторону фонтана вашей команды.",
      "Если использовать Blink для скачка на дистанцию больше максимальной, его дальность сократится до 80% от максимальной.",
    ],
  },
  {
    idx: 1,
    item_name: "item_blades_of_attack",
    description: " ",
    name: "Blades of Attack",
    specials: ["урон: +9"],
    cost: 420,
    recipe: false,
    notes: [],
  },
  {
    idx: 2,
    item_name: "item_broadsword",
    description: " ",
    name: "Broadsword",
    specials: ["урон: +18"],
    cost: 1200,
    recipe: false,
    notes: [],
  },
  {
    idx: 3,
    item_name: "item_chainmail",
    description: " ",
    name: "Chainmail",
    specials: ["броня: +5"],
    cost: 550,
    recipe: false,
    notes: [],
  },
  {
    idx: 4,
    item_name: "item_claymore",
    description: " ",
    name: "Claymore",
    specials: ["урон: +21"],
    cost: 1400,
    recipe: false,
    notes: [],
  },
  {
    idx: 5,
    item_name: "item_helm_of_iron_will",
    description: " ",
    name: "Helm of Iron Will",
    specials: ["броня: +5", "регенерация здоровья: +3"],
    cost: 900,
    recipe: false,
    notes: [],
  },
  {
    idx: 6,
    item_name: "item_javelin",
    description:
      "Пассивная: Pierce — дает шанс нанести дополнительный урон при каждой атаке.",
    name: "Javelin",
    specials: ["урон: +21", "шанс пронзить: 20%", "пронзающий урон: 40"],
    cost: 1500,
    recipe: false,
    notes: [],
  },
  {
    idx: 7,
    item_name: "item_mithril_hammer",
    description: " ",
    name: "Mithril Hammer",
    specials: ["урон: +24"],
    cost: 1600,
    recipe: false,
    notes: [],
  },
  {
    idx: 8,
    item_name: "item_platemail",
    description: " ",
    name: "Platemail",
    specials: ["броня: +10"],
    cost: 1400,
    recipe: false,
    notes: [],
  },
  {
    idx: 9,
    item_name: "item_quarterstaff",
    description: " ",
    name: "Quarterstaff",
    specials: ["урон: +10", "скорость атаки: +10"],
    cost: 875,
    recipe: false,
    notes: [],
  },
  {
    idx: 10,
    item_name: "item_quelling_blade",
    description:
      "Активируемая: Chop Tree/Ward — уничтожает выбранное дерево или вард. Дальность использования больше, если цель способности — вард.\nПассивная: Quell — увеличивает урон от атак по юнитам, не являющимися героями, в зависимости от типа атаки владельца. Не увеличивает урон по Рошану.",
    name: "Quelling Blade",
    specials: [
      "доп. урон в ближнем бою: 140%",
      "доп. урон в дальнем бою: 115%",
      "дальность применения: 350",
      "дальность уничтожения варда: 450",
    ],
    cooldown: 4,
    cost: 225,
    recipe: false,
    notes: ["Можно носить только один экземпляр."],
  },
  {
    idx: 11,
    item_name: "item_ring_of_protection",
    description: " ",
    name: "Ring of Protection",
    specials: ["броня: +3"],
    cost: 200,
    recipe: false,
    notes: [],
  },
  {
    idx: 12,
    item_name: "item_stout_shield",
    description:
      "Пассивная: Damage Block — дает шанс заблокировать урон в зависимости от типа атаки вашего героя.",
    name: "Stout Shield",
    specials: [
      "блок урона на героях ближнего боя: 16",
      "блок урона на героях дальнего боя: 8",
      "шанс блока: 50%",
    ],
    cost: 200,
    recipe: false,
    notes: ["Блокировка урона от нескольких источников не сочетается."],
  },
  {
    idx: 13,
    item_name: "item_recipe_moon_shard",
    description: "",
    name: "Рецепт Moon Shard",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 14,
    item_name: "item_moon_shard",
    description:
      "Использование: поглощает Moon Shard и навсегда увеличивает скорость атаки на 60. Повторное использование невозможно.\nПассивная: Shade Sight - увеличивает радиус обзора ночью на 250.",
    name: "Moon Shard",
    specials: [
      "скорость атаки: +120",
      "дополнительный обзор ночью: 250",
      "скорость атаки при поглощении: 60",
    ],
    cost: 4000,
    recipe: false,
    notes: [],
  },
  {
    idx: 15,
    item_name: "item_gauntlets",
    description: " ",
    name: "Gauntlets of Strength",
    specials: ["сила: +3"],
    cost: 150,
    recipe: false,
    notes: [],
  },
  {
    idx: 16,
    item_name: "item_slippers",
    description: " ",
    name: "Slippers of Agility",
    specials: ["ловкость: +3"],
    cost: 150,
    recipe: false,
    notes: [],
  },
  {
    idx: 17,
    item_name: "item_mantle",
    description: " ",
    name: "Mantle of Intelligence",
    specials: ["интеллект: +3"],
    cost: 150,
    recipe: false,
    notes: [],
  },
  {
    idx: 18,
    item_name: "item_branches",
    description: "  ",
    name: "Iron Branch",
    specials: ["атрибуты: +1"],
    cost: 50,
    recipe: false,
    notes: [],
  },
  {
    idx: 19,
    item_name: "item_belt_of_strength",
    description: " ",
    name: "Belt of Strength",
    specials: ["сила: +6"],
    cost: 450,
    recipe: false,
    notes: [],
  },
  {
    idx: 20,
    item_name: "item_boots_of_elves",
    description: " ",
    name: "Band of Elvenskin",
    specials: ["ловкость: +6"],
    cost: 450,
    recipe: false,
    notes: [],
  },
  {
    idx: 21,
    item_name: "item_robe",
    description: " ",
    name: "Robe of the Magi",
    specials: ["интеллект: +6"],
    cost: 450,
    recipe: false,
    notes: [],
  },
  {
    idx: 22,
    item_name: "item_circlet",
    description: " ",
    name: "Circlet",
    specials: ["атрибуты: +2"],
    cost: 165,
    recipe: false,
    notes: [],
  },
  {
    idx: 23,
    item_name: "item_ogre_axe",
    description: " ",
    name: "Ogre Club",
    specials: ["сила: +10"],
    cost: 1000,
    recipe: false,
    notes: [],
  },
  {
    idx: 24,
    item_name: "item_blade_of_alacrity",
    description: " ",
    name: "Blade of Alacrity",
    specials: ["ловкость: +10"],
    cost: 1000,
    recipe: false,
    notes: [],
  },
  {
    idx: 25,
    item_name: "item_staff_of_wizardry",
    description: " ",
    name: "Staff of Wizardry",
    specials: ["интеллект: +10"],
    cost: 1000,
    recipe: false,
    notes: [],
  },
  {
    idx: 26,
    item_name: "item_ultimate_orb",
    description: " ",
    name: "Ultimate Orb",
    specials: ["атрибуты: +10"],
    cost: 2100,
    recipe: false,
    notes: [],
  },
  {
    idx: 27,
    item_name: "item_gloves",
    description: "  ",
    name: "Gloves of Haste",
    specials: ["скорость атаки: +20"],
    cost: 500,
    recipe: false,
    notes: [],
  },
  {
    idx: 28,
    item_name: "item_lifesteal",
    description:
      "Пассивная: Lifesteal — дает владельцу вампиризм, который с каждой атакой восстанавливает его здоровье на часть нанесенного урона.\n\nMorbid Mask — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки.",
    name: "Morbid Mask",
    specials: ["вампиризм: 15%"],
    cost: 900,
    recipe: false,
    notes: [],
  },
  {
    idx: 29,
    item_name: "item_ring_of_regen",
    description: " ",
    name: "Ring of Regen",
    specials: ["регенерация здоровья: +2"],
    cost: 350,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 30,
    item_name: "item_sobi_mask",
    description: " ",
    name: "Sage's Mask",
    specials: ["регенерация маны: +50"],
    cost: 325,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 31,
    item_name: "item_boots",
    description:
      "Основные бонусы к скорости передвижения от нескольких пар ботинок не складываются.",
    name: "Boots of Speed",
    specials: ["скорость передвижения: +50"],
    cost: 450,
    recipe: false,
    notes: [],
  },
  {
    idx: 32,
    item_name: "item_gem",
    description:
      "Пассивная: True Sight — дает носителю и его союзникам возможность видеть невидимых юнитов и варды в определенном радиусе.\nВыпадает при смерти и не может быть уничтожен.",
    name: "Gem of True Sight",
    specials: ["радиус true sight: 1100"],
    cost: 900,
    recipe: false,
    notes: ["Не действует, пока находится у курьера."],
  },
  {
    idx: 33,
    item_name: "item_cloak",
    description: "",
    name: "Cloak",
    specials: ["сопротивление магии: 20", "+20"],
    cost: 550,
    recipe: false,
    notes: [
      "Сочетается по закону убывающей полезности с другими источниками сопротивления магии.",
    ],
  },
  {
    idx: 34,
    item_name: "item_talisman_of_evasion",
    description:
      "Сочетается по закону убывающей полезности с другими источниками уклонения.",
    name: "Talisman of Evasion",
    specials: ["уклонение: +25"],
    cost: 1800,
    recipe: false,
    notes: [],
  },
  {
    idx: 35,
    item_name: "item_cheese",
    description:
      "Использование: исчезает и мгновенно восстанавливает здоровье и ману.",
    name: "Cheese",
    specials: ["пополняет здоровья: 2500", "пополняет маны: 1000"],
    cooldown: 40,
    cost: 1000,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 36,
    item_name: "item_magic_stick",
    description:
      "Активируемая: Energy Charge — восстанавливает здоровье и ману в зависимости от количества имеющихся зарядов (максимум: 10). За каждое использование способности врагом, который видим и находится неподалеку, добавляется один заряд.",
    name: "Magic Stick",
    specials: ["зарядов: 10", "здоровья/маны за заряд: 15"],
    cooldown: 13,
    cost: 200,
    recipe: false,
    notes: [
      "Дает заряды за использование заклинаний видимыми врагами в радиусе 1200 единиц.",
      "Некоторые способности и предметы не добавляют зарядов.",
    ],
  },
  {
    idx: 37,
    item_name: "item_recipe_magic_wand",
    description: "",
    name: "Рецепт Magic Wand",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 38,
    item_name: "item_magic_wand",
    description:
      "Активируемая: Energy Charge — восстанавливает здоровье и ману в зависимости от количества имеющихся зарядов (максимум: 17). За каждое использование способности врагом, который видим и находится неподалеку, добавляется один заряд.",
    name: "Magic Wand",
    specials: ["зарядов: 17", "атрибуты: +4", "здоровья/маны за заряд: 15"],
    cooldown: 13,
    cost: 465,
    recipe: false,
    notes: [
      "Дает заряды за использование заклинаний видимыми врагами в радиусе 1200 единиц.",
      "Некоторые способности и предметы не добавляют зарядов.",
    ],
  },
  {
    idx: 39,
    item_name: "item_ghost",
    description:
      "Активируемая: Ghost Form — придает бесплотную форму, в которой герой полностью защищен от физического урона, но получает на 40%% больше урона от заклинаний и теряет возможность атаковать.\nИспользование Town Portal Scroll или Boots of Travel не развеивает бесплотную форму.",
    name: "Ghost Scepter",
    specials: ["атрибуты: +5", "длительность: 4", "доп. магический урон: -40%"],
    cooldown: 30,
    cost: 1500,
    recipe: false,
    notes: [
      "Окончится, если вы станете невосприимчивы к заклинаниям, а также не подействует, если вы уже невосприимчивы к ним.",
      "Объединенное время перезарядки с Ethereal Blade.",
    ],
  },
  {
    idx: 40,
    item_name: "item_clarity",
    description: "",
    name: "Clarity",
    specials: ["пополняет маны: 170", "длительность: 45"],
    cost: 50,
    recipe: false,
    notes: [],
  },
  {
    idx: 41,
    item_name: "item_enchanted_mango",
    description: "",
    name: "Enchanted Mango",
    specials: ["регенерация здоровья: +1", "восстановление маны: 150"],
    cost: 125,
    recipe: false,
    notes: [],
  },
  {
    idx: 42,
    item_name: "item_flask",
    description: "",
    name: "Healing Salve",
    specials: ["длительность: 8", "пополняет здоровья: 400"],
    cost: 110,
    recipe: false,
    notes: [],
  },
  {
    idx: 43,
    item_name: "item_dust",
    description:
      "Использование: делает всех невидимых героев поблизости видимыми и замедляет их.",
    name: "Dust of Appearance",
    specials: ["длительность: 12", "радиус: 1050", "замедление: -20%"],
    cooldown: 30,
    cost: 180,
    recipe: false,
    notes: [
      "Осыпает врагов пылью, которая предотвращает их уход в невидимость.",
    ],
  },
  {
    idx: 44,
    item_name: "item_bottle",
    description:
      "Использование: теряет один заряд и постепенно восстанавливает цели здоровье и ману. Восстановление прекращается при получении урона. Пустую бутыль можно пополнить возле союзного фонтана. В ней также можете хранить руны для последующего использования. Спустя 2 минуты помещенная в бутыль руна задействуется сама. Если бутыль не полна, то несущий ее курьер передвигается на 30%% медленнее.\n\nЧтобы использовать бутыль на союзном герое, удерживайте клавишу Ctrl. Руны не передаются другим героям.",
    name: "Bottle",
    specials: [
      "пополняет здоровья: 110",
      "пополняет маны: 70",
      "длительность: 3",
      "скорость передвижения%: -30",
    ],
    cooldown: 0.5,
    cost: 700,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 45,
    item_name: "item_ward_observer",
    description:
      "Использование: устанавливает Observer Ward, невидимого стража, который дает обзор близлежащей местности. Действует 7 мин.\n\nЧтобы передать один Observer Ward союзному герою, удерживайте клавишу Ctrl.",
    name: "Observer Ward",
    specials: [
      "длительность: 420",
      "дальность обзора: 1600",
      "здоровье: 200",
      "длительность (в минутах): 7",
    ],
    cooldown: 1,
    cost: 75,
    recipe: false,
    notes: [],
  },
  {
    idx: 46,
    item_name: "item_ward_sentry",
    description:
      "Использование: устанавливает Sentry Ward, невидимого стража, который имеет способность True Sight, раскрывающую невидимых юнитов в близлежащей местности. Действует 4 мин.\n\nЧтобы передать один Sentry Ward союзному герою, удерживайте клавишу Ctrl.",
    name: "Sentry Ward",
    specials: [
      "длительность: 240",
      "дальность true sight: 850",
      "здоровье: 200",
      "длительность (в минутах): 4",
    ],
    cooldown: 1,
    cost: 200,
    recipe: false,
    notes: [],
  },
  {
    idx: 47,
    item_name: "item_recipe_ward_dispenser",
    description: "",
    name: "Рецепт Варды",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 48,
    item_name: "item_ward_dispenser",
    description:
      "Нажмите дважды, чтобы сменить вид выбранного варда.\n\nИспользование: устанавливает выбранный вард в указанной местности. Observer Ward дает вашей команде обзор территории. Sentry Ward имеют True Sight — способность, раскрывающую невидимых юнитов и варды, если они попадают в обзор любого союзника.",
    name: "Варды",
    specials: [
      "здоровье: 100",
      "радиус обзора observer ward: 1600",
      "длительность observer ward (в мин.): 7",
      "радиус раскрытия sentry ward: 850",
      "длительность sentry ward (в мин.): 4",
    ],
    cost: 275,
    recipe: false,
    notes: [],
  },
  {
    idx: 49,
    item_name: "item_tango",
    description:
      "Использование: съедает дерево или вард, постепенно восстанавливая здоровье.\n\nМожно использовать 4 раза. Используйте на союзном герое, чтобы дать ему один Tango.",
    name: "Tango",
    specials: [
      "пополняет здоровья от деревьев: 115",
      "восстановление здоровья вардом: 230",
      "дальность поедания варда: 450",
      "длительность лечения: 16",
    ],
    cost: 125,
    recipe: false,
    notes: [],
  },
  {
    idx: 50,
    item_name: "item_tango_single",
    description:
      "Использование: съедает дерево или вард, постепенно восстанавливая здоровье.",
    name: "Tango (не свой)",
    specials: [
      "пополняет здоровья от деревьев: 115",
      "восстановление здоровья вардом: 230",
      "дальность поедания варда: 450",
      "длительность лечения: 16",
    ],
    cooldown: 60,
    cost: 30,
    recipe: false,
    notes: [],
  },
  {
    idx: 51,
    item_name: "item_courier",
    description:
      "Активируемая: Deploy Courier — создает существо, которое переносит вещи на вашу базу и обратно.",
    name: "Animal Courier",
    specials: [],
    cost: 120,
    recipe: false,
    notes: [],
  },
  {
    idx: 52,
    item_name: "item_tpscroll",
    description:
      "Использование: телепортирует вас к выбранной союзной постройке. Двойное нажатие телепортирует вас к фонтану вашей команды.",
    name: "Town Portal Scroll",
    specials: [
      "минимальная дистанция: 70",
      "максимальная дистанция: 575",
      "радиус обзора: 200",
    ],
    cooldown: 70,
    cost: 75,
    recipe: false,
    notes: [
      "Если несколько героев будут телепортироваться в одно место, то длительность телепортации будет возрастать для каждого следующего героя.",
    ],
  },
  {
    idx: 53,
    item_name: "item_recipe_travel_boots",
    description: "",
    name: "Рецепт Boots of Travel",
    specials: [],
    cost: 2000,
    recipe: true,
    notes: [],
  },
  {
    idx: 54,
    item_name: "item_recipe_travel_boots_2",
    description: "",
    name: "Рецепт Boots of Travel",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 55,
    item_name: "item_travel_boots",
    description:
      "Активируемая: Teleport — телепортирует вас к дружественному юниту, не являющимся героем, или сооружению. Двойное нажатие телепортирует вас к фонтану вашей команды. Улучшение позволяет телепортироваться к союзным героям.\n\nОсновные бонусы к скорости передвижения от нескольких пар ботинок не складываются.",
    name: "Boots of Travel",
    specials: ["скорость передвижения: +100"],
    cooldown: 45,
    cost: 2450,
    recipe: false,
    notes: ["Объединенное время перезарядки с Town Portal Scroll."],
  },
  {
    idx: 56,
    item_name: "item_travel_boots_2",
    description:
      "Активируемая: Teleport — телепортирует вас к дружественному сооружению или юниту, включая героев. Двойное нажатие телепортирует вас к фонтану вашей команды.\n\nОсновные бонусы к скорости передвижения от нескольких пар ботинок не складываются.",
    name: "Boots of Travel",
    specials: ["скорость передвижения: +100"],
    cooldown: 45,
    cost: 4450,
    recipe: false,
    notes: ["Объединенное время перезарядки с Town Portal Scroll."],
  },
  {
    idx: 57,
    item_name: "item_recipe_phase_boots",
    description: "",
    name: "Рецепт Phase Boots",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 58,
    item_name: "item_phase_boots",
    description:
      "Активируемая: Phase — увеличивает скорость передвижения и позволяет проходить сквозь юнитов. Сила эффекта зависит от типа атаки владельца. Эффект снимается преждевременно, если будет использован другой предмет или способность.\n\nОсновные бонусы к скорости передвижения от нескольких пар ботинок не складываются.",
    name: "Phase Boots",
    specials: [
      "скорость передвижения: +50",
      "урон: +24",
      "скорость атаки: 0",
      "ускорение в ближнем бою: 24%",
      "ускорение в дальнем бою: 20%",
      "длительность действия: 2.5",
    ],
    cooldown: 8,
    cost: 1290,
    recipe: false,
    notes: [],
  },
  {
    idx: 59,
    item_name: "item_demon_edge",
    description: "  ",
    name: "Demon Edge",
    specials: ["урон: +46"],
    cost: 2400,
    recipe: false,
    notes: [],
  },
  {
    idx: 60,
    item_name: "item_eagle",
    description: "  ",
    name: "Eaglesong",
    specials: ["ловкость: +25"],
    cost: 3200,
    recipe: false,
    notes: [],
  },
  {
    idx: 61,
    item_name: "item_reaver",
    description: "  ",
    name: "Reaver",
    specials: ["сила: +25"],
    cost: 3000,
    recipe: false,
    notes: [],
  },
  {
    idx: 62,
    item_name: "item_relic",
    description: "  ",
    name: "Sacred Relic",
    specials: ["урон: +60"],
    cost: 3800,
    recipe: false,
    notes: [],
  },
  {
    idx: 63,
    item_name: "item_hyperstone",
    description: "  ",
    name: "Hyperstone",
    specials: ["скорость атаки: +55"],
    cost: 2000,
    recipe: false,
    notes: [],
  },
  {
    idx: 64,
    item_name: "item_ring_of_health",
    description: "  ",
    name: "Ring of Health",
    specials: ["регенерация здоровья: +5"],
    cost: 850,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 65,
    item_name: "item_void_stone",
    description: " ",
    name: "Void Stone",
    specials: ["регенерация маны: +100"],
    cost: 850,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 66,
    item_name: "item_mystic_staff",
    description: "  ",
    name: "Mystic Staff",
    specials: ["интеллект: +25"],
    cost: 2700,
    recipe: false,
    notes: [],
  },
  {
    idx: 67,
    item_name: "item_energy_booster",
    description: "  ",
    name: "Energy Booster",
    specials: ["мана: +250"],
    cost: 900,
    recipe: false,
    notes: [],
  },
  {
    idx: 68,
    item_name: "item_point_booster",
    description: "\r\n",
    name: "Point Booster",
    specials: ["мана: +150", "здоровье: +200"],
    cost: 1200,
    recipe: false,
    notes: [],
  },
  {
    idx: 69,
    item_name: "item_vitality_booster",
    description: " ",
    name: "Vitality Booster",
    specials: ["здоровье: +250"],
    cost: 1100,
    recipe: false,
    notes: [],
  },
  {
    idx: 70,
    item_name: "item_recipe_power_treads",
    description: "",
    name: "Рецепт Power Treads",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 71,
    item_name: "item_power_treads",
    description:
      "Активируемая: Switch Attribute — меняет значение выбранного параметра между силой, ловкостью и интеллектом.\n\nPower Treads могут быть собраны с помощью Belt of Strength, Band of Elvenskin или Robe of the Magi. Основные бонусы к скорости передвижения от нескольких пар ботинок не складываются. Бонусы к скорости атаки от нескольких Power Treads не складываются.",
    name: "Power Treads",
    specials: [
      "скорость передвижения: +50",
      "атрибуты: +9",
      "скорость атаки: +25",
      "урон: 0",
    ],
    cost: 1400,
    recipe: false,
    notes: [],
  },
  {
    idx: 72,
    item_name: "item_recipe_hand_of_midas",
    description: "",
    name: "Рецепт Hand of Midas",
    specials: [],
    cost: 1550,
    recipe: true,
    notes: [],
  },
  {
    idx: 73,
    item_name: "item_hand_of_midas",
    description:
      "Активируемая: Transmute — мгновенно убивает цель (не героя), давая 190 золота и в 2.5 раза больше опыта. Невозможно использовать на древних крипах.",
    name: "Hand of Midas",
    specials: [
      "скорость атаки: +30",
      "множитель опыта: 2.5",
      "дополнительное золото: 190",
      "дальность применения: 600",
    ],
    cooldown: 100,
    cost: 2050,
    recipe: false,
    notes: [
      "Получаемое золото идет в надежный запас (при этом за убийство крипа стандартная награда не дается).",
      "Опыт от превращения не делится с другими героями.",
    ],
  },
  {
    idx: 74,
    item_name: "item_recipe_oblivion_staff",
    description: "",
    name: "Рецепт Oblivion Staff",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 75,
    item_name: "item_oblivion_staff",
    description: "  ",
    name: "Oblivion Staff",
    specials: [
      "интеллект: +6",
      "скорость атаки: +10",
      "урон: +15",
      "регенерация маны: +75",
    ],
    cost: 1650,
    recipe: false,
    notes: [],
  },
  {
    idx: 76,
    item_name: "item_recipe_pers",
    description: "",
    name: "Рецепт Perseverance",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 77,
    item_name: "item_pers",
    description: "  ",
    name: "Perseverance",
    specials: [
      "регенерация здоровья: +5",
      "регенерация маны: +125",
      "урон: +10",
    ],
    cost: 1700,
    recipe: false,
    notes: ["Можно передавать союзникам."],
  },
  {
    idx: 78,
    item_name: "item_recipe_poor_mans_shield",
    description: "",
    name: "Рецепт Poor Man's Shield",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 79,
    item_name: "item_poor_mans_shield",
    description:
      "Пассивная: Damage Block — блокирует некоторое количество урона, наносимого физической атакой, в зависимости от типа атаки вашего героя. Poor Man's Shield всегда будет блокировать урон, наносимый вражескими героями, но урон от крипов блокируется с вероятностью в 53%%.",
    name: "Poor Man's Shield",
    specials: [
      "ловкость: +6",
      "блок урона на героях ближнего боя: 20",
      "блок урона на героях дальнего боя: 10",
      "шанс блока ударов крипов: 53%",
      "шанс блока против героев: 100",
    ],
    cost: 500,
    recipe: false,
    notes: ["Блокировка урона от нескольких источников не сочетается."],
  },
  {
    idx: 80,
    item_name: "item_recipe_bracer",
    description: "",
    name: "Рецепт Bracer",
    specials: [],
    cost: 210,
    recipe: true,
    notes: [],
  },
  {
    idx: 81,
    item_name: "item_bracer",
    description: "  ",
    name: "Bracer",
    specials: ["сила: +6", "ловкость: +3", "интеллект: +3", "урон: +3"],
    cost: 525,
    recipe: false,
    notes: [],
  },
  {
    idx: 82,
    item_name: "item_recipe_wraith_band",
    description: "",
    name: "Рецепт Wraith Band",
    specials: [],
    cost: 170,
    recipe: true,
    notes: [],
  },
  {
    idx: 83,
    item_name: "item_wraith_band",
    description: "  ",
    name: "Wraith Band",
    specials: ["сила: +3", "ловкость: +6", "интеллект: +3", "урон: +3"],
    cost: 485,
    recipe: false,
    notes: [],
  },
  {
    idx: 84,
    item_name: "item_recipe_null_talisman",
    description: "",
    name: "Рецепт Null Talisman",
    specials: [],
    cost: 155,
    recipe: true,
    notes: [],
  },
  {
    idx: 85,
    item_name: "item_null_talisman",
    description: "  ",
    name: "Null Talisman",
    specials: ["сила: +3", "ловкость: +3", "интеллект: +6", "урон: +3"],
    cost: 470,
    recipe: false,
    notes: [],
  },
  {
    idx: 86,
    item_name: "item_recipe_mekansm",
    description: "",
    name: "Рецепт Mekansm",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 87,
    item_name: "item_mekansm",
    description:
      "Активируемая: Restore — восстанавливает 250 здоровья и дает +2 брони в радиусе 900 вокруг владельца.\nПассивная: Mekansm Aura — увеличивает скорость восстановления здоровья на 4 у союзников в радиусе 900 вокруг владельца.\n\nЭффекты от нескольких Mekansm Aura не складываются.",
    name: "Mekansm",
    specials: [
      "атрибуты: +5",
      "броня: +5",
      "радиус ауры: 900",
      "восстановление здоровья в ауре: 4",
      "лечение от restore: 250",
      "доп. броня от restore: 2",
      "время действия доп. брони: 25",
      "радиус ауры/способности: 900",
    ],
    cooldown: 65,
    cost: 2300,
    recipe: false,
    notes: [
      "Эффект не распространяется на союзников, которые уже получали его в течение последних 25 секунд.",
    ],
  },
  {
    idx: 88,
    item_name: "item_recipe_vladmir",
    description: "",
    name: "Рецепт Vladmir's Offering",
    specials: [],
    cost: 300,
    recipe: true,
    notes: [],
  },
  {
    idx: 89,
    item_name: "item_vladmir",
    description:
      "Пассивная: Vladmir's Aura — дает эффект вампиризма, дополнительный урон и броню, а также усиливает восстановление здоровья и маны у всех союзников в радиусе 900. Эффект вампиризма Vladmir's Aura зависит от типа атаки героя.\n\nЭффекты от нескольких Vladmir's Aura не складываются.",
    name: "Vladmir's Offering",
    specials: [
      "атрибуты: +2",
      "восстановление здоровья в ауре: 3",
      "реген маны в ауре: 0.8",
      "аура доп. брони: 5",
      "доп. урон в ауре: 15%",
      "вампиризм в ближнем бою: 15%",
      "вампиризм в дальнем бою: 10%",
      "радиус ауры: 900",
    ],
    cost: 2325,
    recipe: false,
    notes: [
      "Не сочетается с аурами Ring of Basilius, Ring of Aquila или Vladmir's Offering.",
    ],
  },
  {
    idx: 90,
    item_name: "item_flying_courier",
    description:
      "Улучшает вашего обычного курьера до летающего, позволяя ему пролетать над препятствиями и ускоряться, чтобы быстрее переносить ваши предметы.\n\nТребуется обычный курьер.",
    name: "Flying Courier",
    specials: [],
    cost: 220,
    recipe: false,
    notes: [],
  },
  {
    idx: 91,
    item_name: "item_recipe_buckler",
    description: "",
    name: "Рецепт Buckler",
    specials: [],
    cost: 200,
    recipe: true,
    notes: [],
  },
  {
    idx: 92,
    item_name: "item_buckler",
    description:
      "Активируемая: Armor Bonus — дает +2 к броне всем союзникам в радиусе 900. Действует 25 секунд на героях, 30 секунд на юнитах.",
    name: "Buckler",
    specials: [
      "броня: +5",
      "атрибуты: +2",
      "радиус способности: 900",
      "аура: броня: 2",
      "аура: длительность: 30",
      "аура: длительность на герояъ: 25",
    ],
    cooldown: 25,
    cost: 800,
    recipe: false,
    notes: [],
  },
  {
    idx: 93,
    item_name: "item_recipe_ring_of_basilius",
    description: "",
    name: "Рецепт Ring of Basilius",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 94,
    item_name: "item_ring_of_basilius",
    description:
      "Пассивная: Basilius Aura — увеличивает скорость регенерации маны и броню в радиусе 900.\nАктивируемая: переключает действие ауры на юнитов, не являющихся героями.\n\nЭффекты от нескольких Basilius Aura не складываются.",
    name: "Ring of Basilius",
    specials: [
      "урон: +6",
      "броня: +1",
      "радиус ауры: 900",
      "реген маны в ауре: 0.65",
      "аура доп. брони: 2",
    ],
    cost: 525,
    recipe: false,
    notes: [
      "Не сочетается с аурами Ring of Basilius, Ring of Aquila или Vladmir's Offering.",
    ],
  },
  {
    idx: 95,
    item_name: "item_recipe_pipe",
    description: "",
    name: "Рецепт Pipe of Insight",
    specials: [],
    cost: 800,
    recipe: true,
    notes: [],
  },
  {
    idx: 96,
    item_name: "item_pipe",
    description:
      "Активируемая: Barrier — создает на себе и союзниках, находящихся в радиусе 900, магический барьер, блокирующий 400 магического урона.\nПассивная: Insight Aura — увеличивает скорость восстановления здоровья на 4 у союзников в радиусе 900 вокруг владельца и увеличивает их сопротивление магии на 10%%.",
    name: "Pipe of Insight",
    specials: [
      "регенерация здоровья: +9",
      "сопротивления магии: +30",
      "длительность эффекта: 50",
      "восстановление здоровья в ауре: 4",
      "сопротивление магии в ауре: 10%",
      "радиус ауры: 900",
      "блокирует урона: 400",
      "длительность барьера: 12",
      "дальность применения: 900",
      "атрибуты: 0",
    ],
    cooldown: 60,
    cost: 3500,
    recipe: false,
    notes: [
      "Эффект не распространяется на союзников, которые уже получали его в течение последних 50 секунд.",
      "Сочетается по закону убывающей полезности с другими источниками сопротивления магии.",
    ],
  },
  {
    idx: 97,
    item_name: "item_recipe_urn_of_shadows",
    description: "",
    name: "Рецепт Urn of Shadows",
    specials: [],
    cost: 250,
    recipe: true,
    notes: [],
  },
  {
    idx: 98,
    item_name: "item_urn_of_shadows",
    description:
      "Активируемая: Soul Release — постепенно восстанавливает здоровье дружественным юнитам, либо наносит постепенный урон вражеским юнитам. Лечебный эффект утрачивается при получении юнитом урона от вражеского героя или башни.\nПолучает заряды каждый раз, когда вражеский герой умирает в радиусе 1400. Заряд получит только артефакт, ближайший к умирающему герою.",
    name: "Urn of Shadows",
    specials: [
      "регенерация маны: +50",
      "сила: +6",
      "радиус: 1400",
      "зарядов изначально: 2",
      "зарядов за убийство: 1",
      "суммарное лечение: 400",
      "суммарный урон: 150",
      "длительность: 8",
      "длительность: 8",
      "дальность применения soul release: 950",
    ],
    cooldown: 7,
    cost: 875,
    recipe: false,
    notes: [
      "Пустая урна получает 2 заряда.",
      "Использование этой способности на противнике, который уже находится под ее действием, обновит длительность ее действия.",
    ],
  },
  {
    idx: 99,
    item_name: "item_recipe_headdress",
    description: "",
    name: "Рецепт Headdress",
    specials: [],
    cost: 200,
    recipe: true,
    notes: [],
  },
  {
    idx: 100,
    item_name: "item_headdress",
    description:
      "Пассивная: Regeneration Aura — постепенно восстанавливает здоровье всем союзникам в радиусе 900.\n\nЭффект нескольких одинаковых аур не складывается.",
    name: "Headdress",
    specials: [
      "атрибуты: +2",
      "восстановление в ауре: 3",
      "радиус ауры регенерации: 900",
    ],
    cost: 600,
    recipe: false,
    notes: [],
  },
  {
    idx: 101,
    item_name: "item_recipe_sheepstick",
    description: "",
    name: "Рецепт Scythe of Vyse",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 102,
    item_name: "item_sheepstick",
    description:
      "Активируемая: Hex — превращает цель в безобидную зверушку на 3.5 сек. Мгновенно уничтожает иллюзии.",
    name: "Scythe of Vyse",
    specials: [
      "сила: +10",
      "ловкость: +10",
      "интеллект: +35",
      "регенерация маны: +150",
      "длительность: 3.5",
      "скорость передвижения: 140",
    ],
    cooldown: 30,
    cost: 5650,
    recipe: false,
    notes: [
      "Основная скорость перемещения цели упадет до 140, но увеличивающие ее бонусы не пропадут.",
    ],
  },
  {
    idx: 103,
    item_name: "item_recipe_orchid",
    description: "",
    name: "Рецепт Orchid Malevolence",
    specials: [],
    cost: 775,
    recipe: true,
    notes: [],
  },
  {
    idx: 104,
    item_name: "item_orchid",
    description:
      "Активируемая: Soul Burn — запрещает выбранной цели колдовать на 5 секунд и увеличивает наносимый ей урон на 30%%.",
    name: "Orchid Malevolence",
    specials: [
      "интеллект: +25",
      "скорость атаки: +30",
      "урон: +30",
      "регенерация маны: +150",
      "увеличение урона от soul burn: 30%",
      "длительность soul burn: 5",
    ],
    cooldown: 18,
    cost: 4075,
    recipe: false,
    notes: [
      "Усиленный урон будет нанесен в конце действия способности в виде магического урона.",
    ],
  },
  {
    idx: 105,
    item_name: "item_recipe_cyclone",
    description: "",
    name: "Рецепт Eul's Scepter of Divinity",
    specials: [],
    cost: 650,
    recipe: true,
    notes: [],
  },
  {
    idx: 106,
    item_name: "item_cyclone",
    description:
      "Активируемая: Cyclone — подбрасывает выбранную цель ураганом в небо, делая ее неуязвимой на 2.5 сек. Можно использовать на себя. Если цель — враг, то по приземлении он получит 50 магического урона.",
    name: "Eul's Scepter of Divinity",
    specials: [
      "интеллект: +10",
      "регенерация маны: +150",
      "скорость передвижения: +40",
      "длительность действия: 2.5",
    ],
    cooldown: 23,
    cost: 2825,
    recipe: false,
    notes: [
      "Вы не можете поднимать союзников в воздух.",
      "Использование предмета на себя проходит сквозь невосприимчивость к заклинаниям.",
      "Cyclone может снимать некоторые положительные и отрицательные эффекты.",
    ],
  },
  {
    idx: 107,
    item_name: "item_recipe_force_staff",
    description: "",
    name: "Рецепт Force Staff",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 108,
    item_name: "item_force_staff",
    description:
      "Активируемая: Force — толкает любой выбранный юнит на расстояние в 600 в направлении его взгляда. При двойном нажатии мгновенно применяется на самого себя.",
    name: "Force Staff",
    specials: [
      "интеллект: +10",
      "регенерация здоровья: +4",
      "дальность толчка: 600",
    ],
    cooldown: 20,
    cost: 2250,
    recipe: false,
    notes: [
      "Применение на себя толкнет вас в направлении вашего взгляда.",
      "Force Staff не прерывает действия цели.",
      "Не действует на юнитов под воздействием способности Chronosphere, Duel или Black Hole.",
    ],
  },
  {
    idx: 109,
    item_name: "item_recipe_dagon",
    description: "",
    name: "Рецепт Dagon",
    specials: [],
    cost: 1250,
    recipe: true,
    notes: [],
  },
  {
    idx: 110,
    item_name: "item_recipe_dagon_2",
    description: "",
    name: "Рецепт Dagon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 111,
    item_name: "item_recipe_dagon_3",
    description: "",
    name: "Рецепт Dagon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 112,
    item_name: "item_recipe_dagon_4",
    description: "",
    name: "Рецепт Dagon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 113,
    item_name: "item_recipe_dagon_5",
    description: "",
    name: "Рецепт Dagon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 114,
    item_name: "item_dagon",
    description:
      "Активируемая: Energy Burst — выпускает мощный всплеск энергии, наносящий урон выбранному вражескому юниту. Улучшаемая.",
    name: "Dagon",
    specials: [
      "интеллект: +13,16,19,22,25",
      "атрибуты: +3",
      "урон: +9",
      "мгновенный урон: 400,500,600,700,800",
      "дальность применения: 600,650,700,750,800",
    ],
    cost: 2720,
    recipe: false,
    notes: [],
  },
  {
    idx: 115,
    item_name: "item_dagon_2",
    description:
      "Активируемая: Energy Burst — выпускает мощный всплеск энергии, наносящий урон выбранному вражескому юниту. Улучшаемая.",
    name: "Dagon",
    specials: [
      "интеллект: +13,16,19,22,25",
      "атрибуты: +3",
      "урон: +9",
      "мгновенный урон: 400,500,600,700,800",
      "дальность применения: 600,650,700,750,800",
    ],
    cost: 3970,
    recipe: false,
    notes: [],
  },
  {
    idx: 116,
    item_name: "item_dagon_3",
    description:
      "Активируемая: Energy Burst — выпускает мощный всплеск энергии, наносящий урон выбранному вражескому юниту. Улучшаемая.",
    name: "Dagon",
    specials: [
      "интеллект: +13,16,19,22,25",
      "атрибуты: +3",
      "урон: +9",
      "мгновенный урон: 400,500,600,700,800",
      "дальность применения: 600,650,700,750,800",
    ],
    cost: 5220,
    recipe: false,
    notes: [],
  },
  {
    idx: 117,
    item_name: "item_dagon_4",
    description:
      "Активируемая: Energy Burst — выпускает мощный всплеск энергии, наносящий урон выбранному вражескому юниту. Улучшаемая.",
    name: "Dagon",
    specials: [
      "интеллект: +13,16,19,22,25",
      "атрибуты: +3",
      "урон: +9",
      "мгновенный урон: 400,500,600,700,800",
      "дальность применения: 600,650,700,750,800",
    ],
    cost: 6470,
    recipe: false,
    notes: [],
  },
  {
    idx: 118,
    item_name: "item_dagon_5",
    description:
      "Активируемая: Energy Burst — выпускает мощный всплеск энергии, наносящий урон выбранному вражескому юниту.",
    name: "Dagon",
    specials: [
      "интеллект: +13,16,19,22,25",
      "атрибуты: +3",
      "урон: +9",
      "мгновенный урон: 400,500,600,700,800",
      "дальность применения: 600,650,700,750,800",
    ],
    cost: 7720,
    recipe: false,
    notes: [],
  },
  {
    idx: 119,
    item_name: "item_recipe_necronomicon",
    description: "",
    name: "Рецепт Necronomicon",
    specials: [],
    cost: 1250,
    recipe: true,
    notes: [],
  },
  {
    idx: 120,
    item_name: "item_recipe_necronomicon_2",
    description: "",
    name: "Рецепт Necronomicon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 121,
    item_name: "item_recipe_necronomicon_3",
    description: "",
    name: "Рецепт Necronomicon",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 122,
    item_name: "item_necronomicon",
    description:
      "Активируемая: Demonic Summoning — призывает на 40 сек. воина и лучника, сила и ловкость которых увеличиваются вместе с уровнем Necronomicon. Воин третьего уровня способен раскрывать невидимых юнитов. Можно улучшить.",
    name: "Necronomicon",
    specials: [
      "интеллект: +15,21,24",
      "сила: +8,12,16",
      "длительность призыва: 40",
      "здоровье воина: 700,800,900",
      "урон воина: 45,60,75",
      "выжигание маны: 20,50,75",
      "сжигание маны воином: 25,50,75",
      "урон от убийства воина: 550,675,800",
      "truesight: 1000",
      "здоровье лучника: 700,800,900",
      "урон лучника: 60,90,120",
      "сжигание маны лучником: 125,175,225",
      "лучник: аура скорости атаки: 400",
      "скорость атаки в ауре лучника: 5,7,9%",
    ],
    cooldown: 95,
    cost: 2700,
    recipe: false,
    notes: [],
  },
  {
    idx: 123,
    item_name: "item_necronomicon_2",
    description:
      "Активируемая: Demonic Summoning — призывает на 40 сек. воина и лучника, сила и ловкость которых увеличиваются вместе с уровнем Necronomicon. Воин третьего уровня способен раскрывать невидимых юнитов. Можно улучшить.",
    name: "Necronomicon",
    specials: [
      "интеллект: +15,21,24",
      "сила: +8,12,16",
      "длительность призыва: 40",
      "здоровье воина: 700,800,900",
      "урон воина: 45,60,75",
      "выжигание маны: 20,50,75",
      "сжигание маны воином: 25,50,75",
      "урон от убийства воина: 550,675,800",
      "truesight: 1000",
      "здоровье лучника: 700,800,900",
      "урон лучника: 60,90,120",
      "сжигание маны лучником: 125,175,225",
      "лучник: аура скорости атаки: 400",
      "скорость атаки в ауре лучника: 5,7,9%",
    ],
    cooldown: 95,
    cost: 3950,
    recipe: false,
    notes: [],
  },
  {
    idx: 124,
    item_name: "item_necronomicon_3",
    description:
      "Активируемая: Demonic Summoning — призывает на 40 сек. воина и лучника, сила и ловкость которых увеличиваются вместе с уровнем Necronomicon. Воин третьего уровня способен раскрывать невидимых юнитов.",
    name: "Necronomicon",
    specials: [
      "интеллект: +15,21,24",
      "сила: +8,12,16",
      "длительность призыва: 40",
      "здоровье воина: 700,800,900",
      "урон воина: 45,60,75",
      "выжигание маны: 20,50,75",
      "сжигание маны воином: 25,50,75",
      "урон от убийства воина: 550,675,800",
      "truesight: 1000",
      "здоровье лучника: 700,800,900",
      "урон лучника: 60,90,120",
      "сжигание маны лучником: 125,175,225",
      "лучник: аура скорости атаки: 400",
      "скорость атаки в ауре лучника: 5,7,9%",
    ],
    cooldown: 95,
    cost: 5200,
    recipe: false,
    notes: [],
  },
  {
    idx: 125,
    item_name: "item_recipe_ultimate_scepter",
    description: "",
    name: "Рецепт Aghanim's Scepter",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 126,
    item_name: "item_ultimate_scepter",
    description:
      "Пассивная: Ultimate Upgrade — улучшает ульт, а также некоторые способности части героев.",
    name: "Aghanim's Scepter",
    specials: ["атрибуты: +10", "здоровье: +200", "мана: +150"],
    cost: 4200,
    recipe: false,
    notes: [],
  },
  {
    idx: 127,
    item_name: "item_recipe_refresher",
    description: "",
    name: "Рецепт Refresher Orb",
    specials: [],
    cost: 1800,
    recipe: true,
    notes: [],
  },
  {
    idx: 128,
    item_name: "item_refresher",
    description:
      "Активируемая: Reset Cooldowns — сбрасывает время перезарядки всех ваших предметов и способностей.",
    name: "Refresher Orb",
    specials: [
      "регенерация здоровья: +10",
      "регенерация маны: +250",
      "урон: +20",
    ],
    cooldown: 195,
    cost: 5200,
    recipe: false,
    notes: [],
  },
  {
    idx: 129,
    item_name: "item_recipe_assault",
    description: "",
    name: "Рецепт Assault Cuirass",
    specials: [],
    cost: 1300,
    recipe: true,
    notes: [],
  },
  {
    idx: 130,
    item_name: "item_assault",
    description:
      "Пассивная: Assault Aura — увеличивает скорость атаки и броню союзникам, при этом снижая броню вражеским юнитам поблизости.\n\nЭффект от нескольких Assault of Aura не складывается.",
    name: "Assault Cuirass",
    specials: [
      "скорость атаки: +35",
      "броня: +10",
      "радиус ауры: 900",
      "аура скорости атаки: 20",
      "доп. броня союзникам в ауре: 5",
      "снижение брони врагам в ауре: -5",
    ],
    cost: 5250,
    recipe: false,
    notes: [],
  },
  {
    idx: 131,
    item_name: "item_recipe_heart",
    description: "",
    name: "Рецепт Heart of Tarrasque",
    specials: [],
    cost: 1400,
    recipe: true,
    notes: [],
  },
  {
    idx: 132,
    item_name: "item_heart",
    description:
      "Пассивная: Health Regeneration — восстанавливает определенный процент максимального здоровья в секунду. Если владелец получит урон от вражеского героя или Рошана, способность отключается на 5 сек. для героев ближнего боя, или на 7 сек. для героев дальнего боя.",
    name: "Heart of Tarrasque",
    specials: [
      "сила: +40",
      "здоровье: +300",
      "восст. здоровья в секунду: 4%",
      "перезарядка(ближний): 5",
      "перезарядка(дальний): 7",
    ],
    cooldown: 7,
    cost: 5500,
    recipe: false,
    notes: [],
  },
  {
    idx: 133,
    item_name: "item_recipe_black_king_bar",
    description: "",
    name: "Рецепт Black King Bar",
    specials: [],
    cost: 1375,
    recipe: true,
    notes: [],
  },
  {
    idx: 134,
    item_name: "item_black_king_bar",
    description:
      "Активируемая: Avatar — дает невосприимчивость к заклинаниям и полное сопротивление магическому урону. Продолжительность и время перезарядки уменьшаются с каждым использованием. Некоторые способности могут проходить сквозь невосприимчивость к заклинаниям.",
    name: "Black King Bar",
    specials: ["сила: +10", "урон: +24", "длительность: 10,9,8,7,6,5"],
    cost: 3975,
    recipe: false,
    notes: [
      "Покупка другого Black King Bar не обновит время его действия.",
      "Использование артефакта Black King Bar снимает некоторые положительные эффекты.",
    ],
  },
  {
    idx: 135,
    item_name: "item_aegis",
    description:
      "Пассивная: Reincarnation — возвращает вас к жизни с полными здоровьем и маной через 5 секунд после вашей смерти на том же месте, где вы погибли. Должно быть использовано в течение 5 минут, иначе Aegis of the Immortal исчезнет. Если это случилось, то оно полностью излечит вас в течение 5 секунд (эффект спадает при получении урона).",
    name: "Aegis of the Immortal",
    specials: [],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 136,
    item_name: "item_recipe_shivas_guard",
    description: "",
    name: "Рецепт Shiva's Guard",
    specials: [],
    cost: 600,
    recipe: true,
    notes: [],
  },
  {
    idx: 137,
    item_name: "item_shivas_guard",
    description:
      "Активируемая: Arctic Blast — выпускает замораживающую волну, которая наносит 200 урона противникам и снижает их скорость передвижения на -40%% на 4 сек.\nПассивная: Freezing Aura — снижает скорость атаки противников в радиусе 900.\n\nЭффекты от нескольких Freezing Aura не складываются.",
    name: "Shiva's Guard",
    specials: [
      "интеллект: +30",
      "броня: +15",
      "радиус ауры: 900",
      "замедление атаки от ауры: -45",
      "урон от взрыва: 200",
      "замедление от взрыва: -40%",
      "длительность замедления: 4",
      "радиус: 900",
    ],
    cooldown: 30,
    cost: 4700,
    recipe: false,
    notes: [
      "Волна распространяется со скоростью в 350 единиц в секунду до максимального размера в 900 единиц.",
      "Замораживающая волна следует за владельцем артефакта.",
    ],
  },
  {
    idx: 138,
    item_name: "item_recipe_bloodstone",
    description: "",
    name: "Рецепт Bloodstone",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 139,
    item_name: "item_bloodstone",
    description:
      "Активная: Pocket Deny — мгновенно убивает вас.\nПассивная: Bloodpact — изначально имеет 8 зарядов и получает 1 дополнительный заряд каждый раз, когда в радиусе 1675 умирает вражеский герой. Каждый заряд увеличивает регенерацию маны на 1 и уменьшает время возрождения на 3 сек. Если владелец Bloodstone умирает, предмет потеряет треть зарядов и восстановит 500 здоровья + 30 здоровья за каждый заряд всем союзникам в радиусе 1675.",
    name: "Bloodstone",
    specials: [
      "здоровье: +500",
      "мана: +400",
      "регенерация здоровья: +9",
      "регенерация маны: +200",
      "радиус получения заряда: 1600",
      "радиус лечения при смерти: 1675",
      "базовое лечение: 500",
      "лечение за заряд: 30",
      "уменьшение времени возрождения за заряд: 3",
      "урон: 0",
    ],
    cooldown: 300,
    cost: 4900,
    recipe: false,
    notes: ["Только первый Bloodstone будет получать заряды."],
  },
  {
    idx: 140,
    item_name: "item_recipe_sphere",
    description: "",
    name: "Рецепт Linken's Sphere",
    specials: [],
    cost: 1325,
    recipe: true,
    notes: [],
  },
  {
    idx: 141,
    item_name: "item_sphere",
    description:
      "Пассивная: Spellblock — блокирует большинство направленных заклинаний каждые 16 сек.\nАктивируемая: Transfer Spellblock — временно снимает пассивный эффект с носителя и передает его выбранному союзнику.",
    name: "Linken's Sphere",
    specials: [
      "атрибуты: +15",
      "регенерация здоровья: +6",
      "регенерация маны: +150",
      "урон: +10",
      "перезарядка: 16",
    ],
    cooldown: 16,
    cost: 5125,
    recipe: false,
    notes: [],
  },
  {
    idx: 142,
    item_name: "item_recipe_lotus_orb",
    description: "",
    name: "Рецепт Lotus Orb",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 143,
    item_name: "item_lotus_orb",
    description:
      "Активируемая: Echo Shell - создает вокруг цели щит, отражающий большинство направленных заклинаний обратно во врага. Вражеские заклинания всё равно будут наносить урон. При применении рассеивает все негативные эффекты.",
    name: "Lotus Orb",
    specials: [
      "урон: +10",
      "броня: +10",
      "регенерация здоровья: +5",
      "регенерация маны: +125",
      "длительность: 6",
      "дальность применения: 900",
    ],
    cooldown: 15,
    cost: 4000,
    recipe: false,
    notes: [],
  },
  {
    idx: 144,
    item_name: "item_recipe_vanguard",
    description: "",
    name: "Рецепт Vanguard",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 145,
    item_name: "item_vanguard",
    description:
      "Пассивная: Damage Block — дает владельцу шанс отразить часть урона от каждой атаки в зависимости от типа атаки вашего героя.",
    name: "Vanguard",
    specials: [
      "здоровье: +250",
      "регенерация здоровья: +6",
      "шанс блока: 75%",
      "блок урона героями ближнего боя: 40",
      "блок урона героями дальнего боя: 20",
    ],
    cost: 2150,
    recipe: false,
    notes: ["Блокировка урона от нескольких источников не сочетается."],
  },
  {
    idx: 146,
    item_name: "item_recipe_crimson_guard",
    description: "",
    name: "Рецепт Crimson Guard",
    specials: [],
    cost: 600,
    recipe: true,
    notes: [],
  },
  {
    idx: 147,
    item_name: "item_crimson_guard",
    description:
      "Активируемая: Guard — дает героям поблизости 2 брони и 100%% шанс заблокировать 55 урона от каждой атаки. Длится 10 секунд.\nПассивная: Damage Block — дает носителю шанс заблокировать урон от каждой атаки, зависящий от типа атаки владельца.",
    name: "Crimson Guard",
    specials: [
      "здоровье: +250",
      "регенерация здоровья: +6",
      "атрибуты: +2",
      "броня: +5",
      "шанс блока: 75%",
      "блок урона у героев ближнего боя: 40",
      "блок урона у героев дальнего боя: 20",
      "брони от guard: 2",
      "длительность guard: 10",
      "радиус guard: 900",
      "блок урона от guard: 55",
      "шанс блока: 100",
    ],
    cooldown: 70,
    cost: 3550,
    recipe: false,
    notes: [
      "Блокировка урона от нескольких источников не сочетается.",
      "Эффект не распространяется на союзников, которые уже получали его в течение последних 70 секунд.",
    ],
  },
  {
    idx: 148,
    item_name: "item_recipe_blade_mail",
    description: "",
    name: "Рецепт Blade Mail",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 149,
    item_name: "item_blade_mail",
    description:
      "Активируемая: Damage Return — отражает любой получаемый урон наносящему его врагу в течение 4.5 сек.",
    name: "Blade Mail",
    specials: [
      "урон: +22",
      "броня: +6",
      "интеллект: +10",
      "длительность действия: 4.5",
    ],
    cooldown: 15,
    cost: 2200,
    recipe: false,
    notes: [
      "Наносит уже просчитанный урон.",
      "Не отражает урон от других Blademail и схожих способностей.",
      "Урон возвращается в чистом виде, но не проходит сквозь защиту от заклинаний.",
    ],
  },
  {
    idx: 150,
    item_name: "item_recipe_soul_booster",
    description: "",
    name: "Рецепт Soul Booster",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 151,
    item_name: "item_soul_booster",
    description: "  ",
    name: "Soul Booster",
    specials: [
      "здоровье: +450",
      "мана: +400",
      "регенерация здоровья: +4",
      "регенерация маны: +100",
    ],
    cost: 3200,
    recipe: false,
    notes: [],
  },
  {
    idx: 152,
    item_name: "item_recipe_hood_of_defiance",
    description: "",
    name: "Рецепт Hood of Defiance",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 153,
    item_name: "item_hood_of_defiance",
    description: "",
    name: "Hood of Defiance",
    specials: ["сопротивление магии: 30", "регенерация здоровья: +9", "+30"],
    cost: 2100,
    recipe: false,
    notes: [
      "Сочетается по закону убывающей полезности с другими источниками сопротивления магии.",
    ],
  },
  {
    idx: 154,
    item_name: "item_recipe_rapier",
    description: "",
    name: "Рецепт Divine Rapier",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 155,
    item_name: "item_rapier",
    description:
      "Выпадает при смерти. Если союзник подобрал этот артефакт, то он теряет свои свойства, пока его не вернут бывшему владельцу. Если его подберет враг, это правило отменяется, позволяя кому угодно получить бонусы от подобранной Divine Rapier. Курьер не может подобрать этот артефакт, если он выпал при смерти.",
    name: "Divine Rapier",
    specials: ["урон: +330"],
    cost: 6200,
    recipe: false,
    notes: [
      "Если Divine Rapier поднимет враг ее предыдущего владельца, то она выпадет только в случае смерти этого врага.",
    ],
  },
  {
    idx: 156,
    item_name: "item_recipe_monkey_king_bar",
    description: "",
    name: "Рецепт Monkey King Bar",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 157,
    item_name: "item_monkey_king_bar",
    description:
      "Пассивная: Mini-Bash — дает шанс нанести дополнительный урон и кратковременно оглушить цель при каждой атаке.\nПассивная: True Strike — исключает шанс промаха при атаке, если только целью не является вражеская постройка.",
    name: "Monkey King Bar",
    specials: [
      "урон: +88",
      "скорость атаки: +15",
      "шанс мини-оглушения: 35%",
      "урон мини-оглушения: 100",
      "длительность оглушения: 0.01",
    ],
    cost: 5400,
    recipe: false,
    notes: [],
  },
  {
    idx: 158,
    item_name: "item_recipe_radiance",
    description: "",
    name: "Рецепт Radiance",
    specials: [],
    cost: 1350,
    recipe: true,
    notes: [],
  },
  {
    idx: 159,
    item_name: "item_radiance",
    description:
      "Активируемая: Toggle Burn — когда включено, каждую секунду наносит 50 урона противникам и ослепляет их, вынуждая промахиваться в 17%% случаев.",
    name: "Radiance",
    specials: [
      "урон: +65",
      "периодический урон: 50",
      "шанс промаха: 17%",
      "радиус: 700",
    ],
    cost: 5150,
    recipe: false,
    notes: [],
  },
  {
    idx: 160,
    item_name: "item_recipe_butterfly",
    description: "",
    name: "Рецепт Butterfly",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 161,
    item_name: "item_butterfly",
    description:
      "Активируемая: Flutter — обменивает шанс уклонения на 25%% дополнительной скорости в течение 6 секунд.\n\nСочетается по закону убывающей полезности с другими источниками уклонения.",
    name: "Butterfly",
    specials: [
      "ловкость: +30",
      "урон: +30",
      "уклонение: +35",
      "скорость атаки: +30",
      "доп. скорость передвижения от flutter: 25%",
      "длительность действия flutter: 6",
    ],
    cooldown: 35,
    cost: 5875,
    recipe: false,
    notes: [],
  },
  {
    idx: 162,
    item_name: "item_recipe_greater_crit",
    description: "",
    name: "Рецепт Daedalus",
    specials: [],
    cost: 1000,
    recipe: true,
    notes: [],
  },
  {
    idx: 163,
    item_name: "item_greater_crit",
    description:
      "Пассивная: Critical Strike — дает шанс нанести дополнительный урон при каждой атаке. Строениям дополнительный урон не наносится.",
    name: "Daedalus",
    specials: ["урон: +81", "шанс крита: 25%", "критический урон: 240%"],
    cost: 5520,
    recipe: false,
    notes: [],
  },
  {
    idx: 164,
    item_name: "item_recipe_basher",
    description: "",
    name: "Рецепт Skull Basher",
    specials: [],
    cost: 1000,
    recipe: true,
    notes: [],
  },
  {
    idx: 165,
    item_name: "item_basher",
    description:
      "Пассивная: Bash — дает каждой атаке шанс оглушить цель на 1.4 сек. и нанести 60 дополнительного урона; шанс зависит от типа атаки владельца.",
    name: "Skull Basher",
    specials: [
      "урон: +25",
      "сила: +8",
      "шанс в ближнем бою: 25%",
      "шанс в дальнем бою: 10%",
      "длительность оглушения: 1.4",
      "перезарядка оглушения: 2.3",
      "доп. урон от bash: 60",
    ],
    cooldown: 2.3,
    cost: 2950,
    recipe: false,
    notes: [
      "Не сочетается с другими источниками оглушения, кроме мини-оглушения (например, от Monkey King Bar).",
      "У Spirit Breaker, Faceless Void, Slardar и Troll Warlord не будет срабатывать Bash.",
    ],
  },
  {
    idx: 166,
    item_name: "item_recipe_bfury",
    description: "",
    name: "Рецепт Battle Fury",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 167,
    item_name: "item_bfury",
    description:
      "Активируемая: Chop Tree/Ward — уничтожает выбранное дерево или вард. Дальность использования больше, если цель способности — вард.\nПассивная: Quell — увеличивает урон от атак по юнитам, не являющимися героями, в зависимости от типа атаки владельца. Не увеличивает урон по Рошану.\nПассивная: Cleave — наносит процент от урона всем врагам в радиусе 280 единиц вокруг цели атаки. Не работает на героях с дальней атакой.",
    name: "Battle Fury",
    specials: [
      "урон: +55",
      "регенерация здоровья: +6",
      "регенерация маны: +150",
      "урон соседним целям: 35%",
      "доп. урон у героев ближнего боя: 160%",
      "доп. урон у героев дальнего боя: 125%",
      "радиус прорубания: 280",
      "дальность действия на дерево: 350",
      "дальность действия на вард: 450",
    ],
    cooldown: 4,
    cost: 4525,
    recipe: false,
    notes: [
      "Урон неосновным целям снижается типом брони, но не ее значением.",
      "Урон неосновным целям проходит через иммунитет к заклинаниям.",
      "Каждый предмет или способность, дарующий прорубающую атаку, наносит урон отдельно друг от друга.",
    ],
  },
  {
    idx: 168,
    item_name: "item_recipe_manta",
    description: "",
    name: "Рецепт Manta Style",
    specials: [],
    cost: 800,
    recipe: true,
    notes: [],
  },
  {
    idx: 169,
    item_name: "item_manta",
    description:
      "Активируемая: Mirror Image — создает 2 зеркальные копии вашего героя, которые существуют 20 сек. Время перезарядки способности зависит от типа атаки владельца: 30 сек. для героев ближнего боя и 45 сек. для героев дальнего боя.\n\nИллюзии героев ближнего боя наносят 33%% урона и получают 350%% урона, а иллюзии героев дальнего боя наносят 28%% урона и получают 400%% урона.\n\nБонусы к скорости передвижения от нескольких предметов на основе Yasha не складываются.",
    name: "Manta Style",
    specials: [
      "сила: +10",
      "ловкость: +26",
      "интеллект: +10",
      "скорость атаки: +15",
      "скорость передвижения: +10",
      "число иллюзий: 2",
      "время жизни иллюзий: 20",
      "урон иллюзий ближнего боя: 33%",
      "урон по иллюзиям ближнего боя: 350%",
      "урон иллюзий дальнего боя: 28%",
      "урон по иллюзиям дальнего боя: 400%",
      "перезарядка(ближний): 30",
      "перезарядка(дальний): 45",
      "радиус обзора: 1000",
    ],
    cooldown: 45,
    cost: 4950,
    recipe: false,
    notes: [
      "Тратит 0,1 секунды на произношение заклинания, во время которого вы неуязвимы.",
      "Использование снимает многие эффекты.",
    ],
  },
  {
    idx: 170,
    item_name: "item_recipe_lesser_crit",
    description: "",
    name: "Рецепт Crystalys",
    specials: [],
    cost: 500,
    recipe: true,
    notes: [],
  },
  {
    idx: 171,
    item_name: "item_lesser_crit",
    description:
      "Пассивная: Critical Strike — дает шанс нанести дополнительный урон при каждой атаке. Строениям дополнительный урон не наносится.",
    name: "Crystalys",
    specials: ["урон: +30", "шанс крита: 20%", "критический урон: 175%"],
    cost: 2120,
    recipe: false,
    notes: [],
  },
  {
    idx: 172,
    item_name: "item_recipe_armlet",
    description: "",
    name: "Рецепт Armlet of Mordiggian",
    specials: [],
    cost: 500,
    recipe: true,
    notes: [],
  },
  {
    idx: 173,
    item_name: "item_armlet",
    description:
      "Активируемая: Unholy Strength — на время действия увеличивает урон на 31 и силу на 25, но отнимает 40 здоровья в секунду. Вы не можете умереть ни от потери здоровья во время действия способности, ни от спада бонуса к силе после ее отключения.",
    name: "Armlet of Mordiggian",
    specials: [
      "урон: +9",
      "скорость атаки: +25",
      "броня: +5",
      "регенерация здоровья: +7",
      "урон: 31",
      "скорость атаки: 0",
      "сила: 25",
      "потеря здоровья: 40",
      "перезарядка: 0.036",
    ],
    cost: 2320,
    recipe: false,
    notes: [
      "Изменение силы действует и на текущий, и на максимальный уровень здоровья, но от него нельзя умереть.",
      "Изменение силы происходит спустя 0,6 секунды.",
      "Включение и выключение Unholy Strength не прерывает чтение заклинаний.",
    ],
  },
  {
    idx: 174,
    item_name: "item_recipe_invis_sword",
    description: "",
    name: "Рецепт Shadow Blade",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 175,
    item_name: "item_invis_sword",
    description:
      "Активируемая: Shadow Walk — делает вас невидимым на время действия или до момента вашей атаки или использования заклинания. Пока Shadow Walk активна, вы движетесь на 20%% быстрее и можете проходить сквозь юнитов. Атака, раскрывающая невидимость, нанесет 175 дополнительного урона. Длится 14 секунд.",
    name: "Shadow Blade",
    specials: [
      "урон: +22",
      "скорость атаки: +30",
      "длительность невидимости: 14",
      "скорость передвижения: 20",
      "урон из невидимости: 175",
    ],
    cooldown: 28,
    cost: 2800,
    recipe: false,
    notes: [
      "Уход в невидимость занимает 0,3 секунды.",
      "Если невидимость кончится без атаки, дополнительный урон будет потерян.",
    ],
  },
  {
    idx: 176,
    item_name: "item_recipe_silver_edge",
    description: "",
    name: "Рецепт Silver Edge",
    specials: [],
    cost: 600,
    recipe: true,
    notes: [],
  },
  {
    idx: 177,
    item_name: "item_silver_edge",
    description:
      "Активируемая: Shadow Walk — делает вас невидимым на время действия или до момента вашей атаки или использования заклинания. Пока Shadow Walk активна, вы движетесь на 20%% быстрее и можете проходить сквозь юнитов. Атака, раскрывающая невидимость, нанесет 225 дополнительного урона, отключит пассивные способности цели и уменьшит весь наносимый ею урон.\nПассивная: Lesser Maim — каждая атака получает шанс нанести травму, уменьшающую скорость передвижения и атаки врага на 4 сек.",
    name: "Silver Edge",
    specials: [
      "урон: +32",
      "скорость атаки: +30",
      "сила: +16",
      "шанс нанести травму: 15%",
      "замедление передвижения: -20%",
      "замедление атаки: -20",
      "длительность травмы: 4",
      "длительность невидимости: 14",
      "скорость передвижения: 20",
      "урон из невидимости: 225",
      "снижение урона цели: -40%",
      "длительность снижения урона: 5",
      "длительность эффектка: 5",
    ],
    cooldown: 24,
    cost: 5450,
    recipe: false,
    notes: [],
  },
  {
    idx: 178,
    item_name: "item_recipe_sange_and_yasha",
    description: "",
    name: "Рецепт Sange and Yasha",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 179,
    item_name: "item_sange_and_yasha",
    description:
      "Пассивная: Greater Maim — каждая атака получает шанс нанести травму, уменьшающую скорость передвижения и атаки врага на 5 сек.\n\nПроцентная прибавка к скорости передвижения от нескольких предметов на основе Yasha не суммируется.",
    name: "Sange and Yasha",
    specials: [
      "урон: +16",
      "сила: +16",
      "ловкость: +16",
      "скорость атаки: +16",
      "скорость передвижения%: +16",
      "шанс нанести травму: 16%",
      "замедление передвижения: -32%",
      "замедление атаки: -32",
      "длительность травмы: 5",
    ],
    cost: 4100,
    recipe: false,
    notes: [],
  },
  {
    idx: 180,
    item_name: "item_recipe_satanic",
    description: "",
    name: "Рецепт Satanic",
    specials: [],
    cost: 1100,
    recipe: true,
    notes: [],
  },
  {
    idx: 181,
    item_name: "item_satanic",
    description:
      "Активируемая: Unholy Rage — увеличивает эффект Lifesteal до 200%% на 4 сек.\nПассивная: Lifesteal — дает владельцу вампиризм, который с каждой атакой восстанавливает его здоровье на часть нанесенного урона.\n\nSatanic — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки.",
    name: "Satanic",
    specials: [
      "урон: +20",
      "сила: +25",
      "броня: +5",
      "вампиризм: 25%",
      "процент вампиризма: 175",
      "вампиризм от unholy rage: 200%",
      "длительность: 4",
    ],
    cooldown: 35,
    cost: 5900,
    recipe: false,
    notes: [],
  },
  {
    idx: 182,
    item_name: "item_recipe_mjollnir",
    description: "",
    name: "Рецепт Mjollnir",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 183,
    item_name: "item_mjollnir",
    description:
      "Активируемая: Static Charge — устанавливает на выбранном юните заряженный щит, который имеет шанс в 20%% ударить разрядом атакующего врага и 4 других.\nПассивная: Chain Lightning — дает шанс при атаке создать разряд цепной молнии, которая скакнет по 12 целям и нанесет каждой по 150 магического урона.\n\nMjollnir — уникальный модификатор атаки, который сочетается с другими уникальными модификаторами атаки, но будет перекрывать их в момент срабатывания молнии.",
    name: "Mjollnir",
    specials: [
      "урон: +24",
      "скорость атаки: +80",
      "время действия щита: 15",
      "шанс срабатывания щита: 20%",
      "отскоков: 4",
      "урон от щита: 200",
      "радиус отскока: 600",
      "радиус удара static charge: 900",
      "перезарядка отскока: 1",
      "шанс разряда: 25%",
      "урон от разряда: 150",
      "целей цепной молнии: 12",
      "радиус скачков молнии: 900",
    ],
    cooldown: 35,
    cost: 5700,
    recipe: false,
    notes: [
      "Срабатывает не чаще, чем раз в секунду.",
      "Молния от способности Static Charge наносит магический урон целям вокруг героя, на котором находится щит. Расстояние до целей не может превышать 900 единиц.",
      "Молнии Static Charge не будут срабатывать на невидимых или скрытых в тумане войны героев.",
    ],
  },
  {
    idx: 184,
    item_name: "item_recipe_skadi",
    description: "",
    name: "Рецепт Eye of Skadi",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 185,
    item_name: "item_skadi",
    description:
      "Пассивная: Cold Attack — каждая атака замедляет скорость передвижения и атаки цели. Длительность эффекта зависит от типа атаки владельца.\n\nEye of Skadi — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки. Eye of Skadi сочетается с модификаторами атаки, дарующими вампиризм.",
    name: "Eye of Skadi",
    specials: [
      "атрибуты: +25",
      "здоровье: +250",
      "мана: +250",
      "замедление передвижения: -35%",
      "замедление атаки: -45",
      "замедление в ближнем бою: 5",
      "замедление в дальнем бою: 2.5",
    ],
    cost: 5675,
    recipe: false,
    notes: [
      "Для героев ближнего боя длится 5 секунд, для героев дальнего боя — 3 секунды.",
    ],
  },
  {
    idx: 186,
    item_name: "item_recipe_sange",
    description: "",
    name: "Рецепт Sange",
    specials: [],
    cost: 600,
    recipe: true,
    notes: [],
  },
  {
    idx: 187,
    item_name: "item_sange",
    description:
      "Пассивная: Lesser Maim — каждая атака получает шанс нанести травму, уменьшающую скорость передвижения и атаки врага на 4 сек.",
    name: "Sange",
    specials: [
      "урон: +10",
      "сила: +16",
      "шанс нанести травму: 15%",
      "замедление передвижения: -20%",
      "замедление атаки: -20",
      "длительность травмы: 4",
    ],
    cost: 2050,
    recipe: false,
    notes: [],
  },
  {
    idx: 188,
    item_name: "item_recipe_helm_of_the_dominator",
    description: "",
    name: "Рецепт Helm of the Dominator",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 189,
    item_name: "item_helm_of_the_dominator",
    description:
      "Активируемая: Dominate — дает контроль над выбранным существом, не являющимся ни героем, ни древним крипом. Запас здоровья прирученного существа увеличивается до указанного минимума.\nПассивная: Lifesteal — дает владельцу вампиризм, который с каждой атакой восстанавливает его здоровье на часть нанесенного урона.\n\nHelm of the Dominator — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки.",
    name: "Helm of the Dominator",
    specials: [
      "урон: +20",
      "броня: +5",
      "регенерация здоровья: +3",
      "вампиризм: 15%",
      "минимальное здоровье: 1400",
    ],
    cooldown: 60,
    cost: 1800,
    recipe: false,
    notes: [
      "Можно иметь только одно прирученное существо. Если будет приручено новое существо, старое умрет.",
      "Продажа или улучшение Helm of the Dominator убьет прирученных юнитов.",
    ],
  },
  {
    idx: 190,
    item_name: "item_recipe_maelstrom",
    description: "",
    name: "Рецепт Maelstrom",
    specials: [],
    cost: 700,
    recipe: true,
    notes: [],
  },
  {
    idx: 191,
    item_name: "item_maelstrom",
    description:
      "Пассивная: Chain Lightning — дает шанс при атаке создать разряд цепной молнии, которая скакнет по 4 целям и нанесет каждой по 120 магического урона.\n\nMaelstrom — уникальный модификатор атаки, который сочетается с другими уникальными модификаторами атаки, но будет перекрывать их в момент срабатывания молнии.",
    name: "Maelstrom",
    specials: [
      "урон: +24",
      "скорость атаки: +25",
      "шанс разряда: 25%",
      "урон от разряда: 120",
      "целей цепной молнии: 4",
      "радиус скачков молнии: 900",
    ],
    cost: 2800,
    recipe: false,
    notes: [],
  },
  {
    idx: 192,
    item_name: "item_recipe_desolator",
    description: "",
    name: "Рецепт Desolator",
    specials: [],
    cost: 300,
    recipe: true,
    notes: [],
  },
  {
    idx: 193,
    item_name: "item_desolator",
    description:
      "Пассивная: Corruption — ваши атаки уменьшают броню цели на 15 секунд.\n\nDesolator — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки.",
    name: "Desolator",
    specials: ["урон: +50", "снижение брони: -7", "длительность эффекта: 15"],
    cost: 3500,
    recipe: false,
    notes: ["Снижение брони действует на здания."],
  },
  {
    idx: 194,
    item_name: "item_recipe_yasha",
    description: "",
    name: "Рецепт Yasha",
    specials: [],
    cost: 600,
    recipe: true,
    notes: [],
  },
  {
    idx: 195,
    item_name: "item_yasha",
    description:
      "Процентные бонусы к скорости от нескольких предметов на основе Yasha не складываются.",
    name: "Yasha",
    specials: [
      "ловкость: +16",
      "скорость атаки: +15",
      "скорость передвижения%: +10",
    ],
    cost: 2050,
    recipe: false,
    notes: [],
  },
  {
    idx: 196,
    item_name: "item_recipe_mask_of_madness",
    description: "",
    name: "Рецепт Mask of Madness",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 197,
    item_name: "item_mask_of_madness",
    description:
      "Активируемая: Berserk — дает 100 к скорости атаки и 17%% к скорости передвижения, но заставляет получать на 30%% больше урона. Длится 12 сек.\nПассивная: Lifesteal — дает владельцу вампиризм, который с каждой атакой восстанавливает его здоровье на часть нанесенного урона.\n\nMask of Madness — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки.",
    name: "Mask of Madness",
    specials: [
      "вампиризм: 20%",
      "доп. скорость атаки: 100",
      "доп. скорость передвижения: 17%",
      "увеличение получаемого урона: 30%",
      "длительность: 12",
    ],
    cooldown: 25,
    cost: 1800,
    recipe: false,
    notes: [],
  },
  {
    idx: 198,
    item_name: "item_recipe_diffusal_blade",
    description: "",
    name: "Рецепт Diffusal Blade",
    specials: [],
    cost: 700,
    recipe: true,
    notes: [],
  },
  {
    idx: 199,
    item_name: "item_recipe_diffusal_blade_2",
    description: "",
    name: "Рецепт Diffusal Blade",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 200,
    item_name: "item_diffusal_blade",
    description:
      "Активируемая: Purge — снимает положительные эффекты и замедляет противника на 4 сек. или снимает отрицательные эффекты с союзника.\nПассивная: Manabreak — каждая ваша атака сжигает 25 маны врага и наносит ему такое же количество физического урона. Иллюзии героев дальнего боя сжигают по 12 маны за атаку. Не складывается с другими способностями, сжигающими ману.\n\nМожно улучшить.",
    name: "Diffusal Blade",
    specials: [
      "ловкость: +20,35",
      "интеллект: +6,10",
      "зарядов: 8",
      "маны выжжено(ближний): 25",
      "маны выжжено(дальний): 25",
      "длительность замедления: 4",
      "урон за сожженную ману: 1",
      "дальность применения: 600",
    ],
    cost: 3150,
    recipe: false,
    notes: [],
  },
  {
    idx: 201,
    item_name: "item_diffusal_blade_2",
    description:
      "Активируемая: Purge — снимает положительные эффекты и замедляет противника на 4 сек. или снимает отрицательные эффекты с союзника.\nПассивная: Manabreak — каждая ваша атака сжигает 25 маны врага и наносит ему такое же количество физического урона. Иллюзии героев дальнего боя сжигают по 12 маны за атаку. Не складывается с другими способностями, сжигающими ману.",
    name: "Diffusal Blade",
    specials: [
      "ловкость: +20,35",
      "интеллект: +6,10",
      "зарядов: 8",
      "маны выжжено(ближний): 25",
      "маны выжжено(дальний): 25",
      "длительность замедления: 4",
      "урон за сожженную ману: 1",
      "дальность применения: 600",
    ],
    cost: 3850,
    recipe: false,
    notes: [],
  },
  {
    idx: 202,
    item_name: "item_recipe_ethereal_blade",
    description: "",
    name: "Рецепт Ethereal Blade",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 203,
    item_name: "item_ethereal_blade",
    description:
      "Активируемая: Ether Blast — выпускает снаряд, который придает вашей цели бесплотную форму. В этой форме цель не может атаковать, получает повышенный магический урон, но полностью защищена от физического урона. При применении на противника тот будет замедлен и получит магический урон в размере 2х вашего основного атрибута +75 ед.\nИспользование Town Portal Scroll или Boots of Travel не развеивает бесплотную форму.",
    name: "Ethereal Blade",
    specials: [
      "ловкость: +40",
      "сила: +10",
      "интеллект: +10",
      "замедление передвижения: -80%",
      "длительность на врагах: 3",
      "множитель урона от ловкости: 2",
      "базовый урон: 75",
      "длительность на союзнике/себе: 4",
      "доп. магический урон: -40%",
      "скорость снаряда: 1200",
    ],
    cooldown: 20,
    cost: 4700,
    recipe: false,
    notes: [
      "Объединенное время перезарядки с Ghost Scepter.",
      "Призрачные юниты получают на 40% больше магического урона.",
      "Длится на секунду больше на союзниках и на себе.",
    ],
  },
  {
    idx: 204,
    item_name: "item_recipe_soul_ring",
    description: "",
    name: "Рецепт Soul Ring",
    specials: [],
    cost: 125,
    recipe: true,
    notes: [],
  },
  {
    idx: 205,
    item_name: "item_soul_ring",
    description:
      "Активируемая: Sacrifice — переводит 150 ед. вашего здоровья в 150 ед. маны. Действует 10 секунд.",
    name: "Soul Ring",
    specials: [
      "регенерация здоровья: +3",
      "регенерация маны: +50",
      "здоровья жертвуется: 150",
      "маны получается: 150",
      "длительность: 10",
    ],
    cooldown: 30,
    cost: 800,
    recipe: false,
    notes: [
      "Если полученная мана превышает порог ее максимального количества, создается запас маны, не зависящий от основного. Если полученную ману не использовать за время действия артефакта, она исчезнет.",
    ],
  },
  {
    idx: 206,
    item_name: "item_recipe_arcane_boots",
    description: "",
    name: "Рецепт Arcane Boots",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 207,
    item_name: "item_arcane_boots",
    description:
      "Активируемая: Replenish Mana — восстанавливает ману всем союзникам в радиусе 900 вокруг героя.\n\nОсновные бонусы к скорости передвижения от нескольких пар ботинок не складываются.",
    name: "Arcane Boots",
    specials: [
      "скорость передвижения: +55",
      "мана: +250",
      "пополняет маны: 135",
      "радиус действия: 900",
    ],
    cooldown: 55,
    cost: 1350,
    recipe: false,
    notes: ["Не работает на клонах Meepo."],
  },
  {
    idx: 208,
    item_name: "item_recipe_octarine_core",
    description: "",
    name: "Рецепт Octarine Core",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 209,
    item_name: "item_octarine_core",
    description:
      "Пассивная: Cooldown Reduction - уменьшает время перезарядки всех способностей и предметов на 25%%.\nПассивная: Spell Lifesteal - дает магический вампиризм, который восстанавливает здоровье в размере доли от нанесенного способностями урона.",
    name: "Octarine Core",
    specials: [
      "интеллект: +25",
      "здоровье: +450",
      "мана: +400",
      "регенерация здоровья: +4",
      "регенерация маны: +100",
      "уменьшение перезарядки: 25%",
      "вампиризм от героев: 25%",
      "вампиризм от крипов: 5%",
    ],
    cost: 5900,
    recipe: false,
    notes: [],
  },
  {
    idx: 210,
    item_name: "item_orb_of_venom",
    description:
      "Пассивная: Poison Attack — отравляет цель, нанося периодический урон и снижая скорость передвижения в зависимости от типа атаки вашего героя.\n\nOrb of Venom — уникальный модификатор атаки, он не будет сочетаться с другими уникальными модификаторами атаки. Orb of Venom сочетается с модификаторами атаки, дарующими вампиризм.",
    name: "Orb of Venom",
    specials: [
      "урон от яда в секунду: 3",
      "замедление от ближних атак: -12%",
      "замедление от дальних атак: -4%",
      "длительность: 4",
    ],
    cost: 275,
    recipe: false,
    notes: [],
  },
  {
    idx: 211,
    item_name: "item_recipe_ancient_janggo",
    description: "",
    name: "Рецепт Drum of Endurance",
    specials: [],
    cost: 875,
    recipe: true,
    notes: [],
  },
  {
    idx: 212,
    item_name: "item_ancient_janggo",
    description:
      "Активируемая: Endurance — дает +25 к скорости атаки и +10%% к скорости передвижения союзников в радиусе 900.\nПассивная: Swiftness Aura — увеличивает скорость атаки и передвижения союзников в радиусе 900.\n\nЭффекты нескольких Swiftness Aura не складываются.",
    name: "Drum of Endurance",
    specials: [
      "атрибуты: +9",
      "урон: +3",
      "аура скорости атаки: 5",
      "аура скорости передвижения: 5%",
      "скорость атаки от endurance: 25",
      "скорость передвижения от endurance: 10%",
      "длительность: 6",
      "радиус ауры/способности: 900",
    ],
    cooldown: 30,
    cost: 1850,
    recipe: false,
    notes: ["Покупка рецепта Drum of Endurance восстановит его заряды."],
  },
  {
    idx: 213,
    item_name: "item_recipe_medallion_of_courage",
    description: "",
    name: "Рецепт Medallion of Courage",
    specials: [],
    cost: 325,
    recipe: true,
    notes: [],
  },
  {
    idx: 214,
    item_name: "item_medallion_of_courage",
    description:
      "Активируемая: Valor — при использовании на союзника увеличивает его броню и снижает вашу. При использовании на противника снижает броню и у вас, и у цели. Не действует на невосприимчивых к магии. Действует на Roshan вполсилы.",
    name: "Medallion of Courage",
    specials: [
      "броня: +7",
      "bonus_mana_regen_pct: +50",
      "снижение брони: -7",
      "длительность: 7",
      "дальность применения: 1000",
    ],
    cooldown: 7,
    cost: 1200,
    recipe: false,
    notes: [],
  },
  {
    idx: 215,
    item_name: "item_recipe_solar_crest",
    description: "",
    name: "Рецепт Solar Crest",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 216,
    item_name: "item_solar_crest",
    description:
      "Активируемая: Shine - временно убирает у владельца дополнительную броню и шанс уклонения, даруемые этим предметом. При использовании на союзнике увеличивает ему броню на 10 и дает шанс уклонения в 25%%. При использовании на противнике уменьшает его броню на 10 и ослепляет, заставляя его промахиваться атаками в 25%% случаев. Не действует на невосприимчивых к магии. Действует на Roshan вполсилы.",
    name: "Solar Crest",
    specials: [
      "броня: +10",
      "bonus_mana_regen_pct: +75",
      "уклонение: +25",
      "доп. броня союзникам: 10",
      "уклонение союзникам: 25%",
      "уменьшение вражеской брони: -10",
      "шанс промаха у врага: 25%",
      "длительность: 7",
      "дальность применения: 1000",
    ],
    cooldown: 7,
    cost: 3000,
    recipe: false,
    notes: [],
  },
  {
    idx: 217,
    item_name: "item_smoke_of_deceit",
    description:
      "Использование: после активации ваш герой и все союзники, которые находятся поблизости, становятся невидимыми и получают дополнительную скорость передвижения на короткое время. Также ваши иконки не будут отображаться на мини-карте. При атаке или приближении к вражеским героям или башням в радиусе 1025 невидимость теряется.",
    name: "Smoke of Deceit",
    specials: ["доп. скорость: 15%", "длительность: 35"],
    cooldown: 90,
    cost: 100,
    recipe: false,
    notes: [],
  },
  {
    idx: 218,
    item_name: "item_recipe_veil_of_discord",
    description: "",
    name: "Рецепт Veil of Discord",
    specials: [],
    cost: 900,
    recipe: true,
    notes: [],
  },
  {
    idx: 219,
    item_name: "item_veil_of_discord",
    description:
      "Активируемая: Magic Weakness — ослабляет врагов, увеличивая магический урон, наносимый им, в течение 16 секунд.",
    name: "Veil of Discord",
    specials: [
      "регенерация здоровья: +6",
      "броня: +6",
      "атрибуты: +6",
      "урон: 6",
      "доп. магический урон: -25%",
      "радиус действия: 600",
      "длительность действия: 16",
    ],
    cooldown: 20,
    cost: 2270,
    recipe: false,
    notes: [],
  },
  {
    idx: 220,
    item_name: "item_recipe_guardian_greaves",
    description: "",
    name: "Рецепт Guardian Greaves",
    specials: [],
    cost: 1650,
    recipe: true,
    notes: [],
  },
  {
    idx: 221,
    item_name: "item_guardian_greaves",
    description:
      "Активируемая: Mend - восстанавливает 250 здоровья и 160 маны всем окружающим союзникам, а также рассеивает большинство отрицательных эффектов на владельце.\nПассивная: Guardian Aura - дарует окружающим союзникам +4 к восстановлению здоровья и +2 к броне. Если в радиусе действия есть союзный герой, уровень здоровья которого ниже 20%%, то для него восстановление здоровья увеличивается до 15, а броня — до 15.",
    name: "Guardian Greaves",
    specials: [
      "скорость передвижения: +55",
      "мана: +250",
      "атрибуты: +5",
      "броня: +5",
      "восстановление здоровья в ауре: 4",
      "доп. броня в ауре: 2",
      "восстановление здоровья для раненых: 15",
      "доп. броня для раненых: 15",
      "порог усиления ауры: 20%",
      "радиус ауры: 900",
      "лечение от способности: 250",
      "маны от способности: 160",
      "радиус действия: 900",
    ],
    cooldown: 40,
    cost: 5300,
    recipe: false,
    notes: ["Аура усиливается только на героях."],
  },
  {
    idx: 222,
    item_name: "item_recipe_rod_of_atos",
    description: "",
    name: "Рецепт Rod of Atos",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 223,
    item_name: "item_rod_of_atos",
    description: "Активируемая: Cripple — снижает скорость передвижения цели.",
    name: "Rod of Atos",
    specials: [
      "интеллект: +30",
      "здоровье: +350",
      "скорость атаки: 0",
      "урон: 0",
      "замедление: 60%",
      "длительность: 4",
      "скорость передвижения: 0",
    ],
    cooldown: 10,
    cost: 3100,
    recipe: false,
    notes: [],
  },
  {
    idx: 224,
    item_name: "item_recipe_abyssal_blade",
    description: "",
    name: "Рецепт Abyssal Blade",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 225,
    item_name: "item_abyssal_blade",
    description:
      "Активируемая: Overwhelm — оглушает выбранного противника на 2 сек. Проходит сквозь невосприимчивость к заклинаниям.\nПассивная: Bash — дает каждой атаке шанс оглушить противника на 1.4 сек. и нанести 60 дополнительного урона; шанс зависит от типа атаки владельца.",
    name: "Abyssal Blade",
    specials: [
      "урон: +85",
      "сила: +10",
      "шанс в ближнем бою: 25%",
      "шанс в дальнем бою: 10%",
      "длительность оглушения: 1.4",
      "доп. урон от bash: 60",
      "перезарядка оглушения: 2.3",
      "длительность оглушения от overwhelm: 2",
    ],
    cooldown: 60,
    cost: 6750,
    recipe: false,
    notes: [
      "Оглушение наносится на дистанции ближнего боя.",
      "Не сочетается с другими оглушениями от ударов.",
      "У Spirit Breaker, Faceless Void, Slardar и Troll Warlord не будет срабатывать Bash.",
    ],
  },
  {
    idx: 226,
    item_name: "item_recipe_heavens_halberd",
    description: "",
    name: "Рецепт Heaven's Halberd",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 227,
    item_name: "item_heavens_halberd",
    description:
      "Активируемая: Disarm — запрещает цели атаковать. Длится 3 сек. при использовании на героях ближнего боя и 4.5 на героях дальнего боя.\nПассивная: Lesser Maim — каждая атака получает шанс нанести травму, уменьшающую скорость передвижения и атаки врага на  4 сек.\n\nСочетается по закону убывающей полезности с другими источниками уклонения.",
    name: "Heaven's Halberd",
    specials: [
      "уклонение: +25",
      "урон: +25",
      "сила: +20",
      "шанс нанести травму: 15%",
      "замедление передвижения: -20%",
      "замедление атаки: -20",
      "длительность травмы: 4",
      "длительность на героях дальнего боя: 4.5",
      "длительность на героях ближнего боя: 3",
      "дальность применения: 600",
    ],
    cooldown: 30,
    cost: 3850,
    recipe: false,
    notes: ["Разоружение снимается только невосприимчивостью к заклинаниям."],
  },
  {
    idx: 228,
    item_name: "item_recipe_ring_of_aquila",
    description: "",
    name: "Рецепт Ring of Aquila",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 229,
    item_name: "item_ring_of_aquila",
    description:
      "Пассивная: Aquila Aura — увеличивает броню и скорость регенерации маны в радиусе 900.\nАктивируемая: переключает действие ауры на юнитов, не являющихся героями.\n\nЭффекты от нескольких Aquila Aura не складываются.",
    name: "Ring of Aquila",
    specials: [
      "урон: +9",
      "сила: +3",
      "ловкость: +9",
      "интеллект: +3",
      "броня: +1",
      "радиус ауры: 900",
      "реген маны в ауре: 0.65",
      "аура доп. брони: 2",
    ],
    cost: 1010,
    recipe: false,
    notes: [
      "Не сочетается с аурами Ring of Basilius, Ring of Aquila или Vladmir's Offering.",
    ],
  },
  {
    idx: 230,
    item_name: "item_recipe_tranquil_boots",
    description: "",
    name: "Рецепт Tranquil Boots",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 231,
    item_name: "item_tranquil_boots",
    description:
      "Пассивная: Break — Tranquil Boots теряют регенерацию здоровья и 30 скорости передвижения на 13 секунд, если владелец атаковал или атакован.",
    name: "Tranquil Boots",
    specials: [
      "скорость передвижения: +90",
      "броня: +4",
      "регенерация здоровья: +12",
      "длительность лечения: 20",
      "лечение: 250",
      "скорость передвижения(сломанные): 60",
    ],
    cooldown: 13,
    cost: 1000,
    recipe: false,
    notes: [],
  },
  {
    idx: 232,
    item_name: "item_shadow_amulet",
    description:
      "Активируемая: Fade — делает вас или союзника невидимым спустя 1.5 сек. Передвижение снимает невидимость. Применение на себя не включает перезарядку.",
    name: "Shadow Amulet",
    specials: ["скорость атаки: +20", "время до невидимости: 1.5"],
    cooldown: 10,
    cost: 1400,
    recipe: false,
    notes: [],
  },
  {
    idx: 233,
    item_name: "item_recipe_glimmer_cape",
    description: "",
    name: "Рецепт Glimmer Cape",
    specials: [],
    cost: 0,
    recipe: true,
    notes: [],
  },
  {
    idx: 234,
    item_name: "item_glimmer_cape",
    description:
      "Активируемая: Glimmer - делает вас или союзника невидимым спустя 0.6 сек., а также дает цели 45%% к сопротивлению магии. Можно использовать во время произнесения заклинаний.",
    name: "Glimmer Cape",
    specials: [
      "скорость атаки: +20",
      "сопротивление магии: +20",
      "задержка невидимости: 0.6",
      "сопротивление магии в невидимости: 45%",
      "длительность: 5",
    ],
    cooldown: 16,
    cost: 1950,
    recipe: false,
    notes: [],
  },
  {
    idx: 235,
    item_name: "item_halloween_candy_corn",
    description:
      "Использование: вы можете положить леденец в свою тыкву, чтобы все герои на карте получили золото и опыт, или можете пожертвовать его разъяренному от голода Roshan. Команда, набравшая больше леденцов, получит приз! Когда вы несете леденец, ваше максимальное здоровье снижается.",
    name: "Грявольская тянучка",
    specials: [],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 236,
    item_name: "item_mystery_hook",
    description: "",
    name: "item_mystery_hook",
    specials: [
      "скорость крюка: 1600",
      "hook_width: 100",
      "дальность крюка: 1300",
      "радиус обзора: 500",
    ],
    cooldown: 11,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 237,
    item_name: "item_mystery_arrow",
    description: "",
    name: "item_mystery_arrow",
    specials: [
      "arrow_speed: 857",
      "arrow_width: 115",
      "arrow_range: 3000",
      "arrow_max_stunrange: 1500",
      "минимальное оглушение: 0.5",
      "максимальное оглушение: 5",
    ],
    cooldown: 2,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 238,
    item_name: "item_mystery_missile",
    description: "",
    name: "item_mystery_missile",
    specials: [
      "длительность оглушения: 2.5",
      "attack_speed_bonus_pct: 400",
      "минимальный урон: 50",
      "максимальное расстояние: 2000",
      "pre_flight_time: 3",
      "урон по героям: 34",
      "скорость: 340",
      "acceleration: 20",
      "enemy_vision_time: 4",
    ],
    cooldown: 20,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 239,
    item_name: "item_mystery_toss",
    description: "",
    name: "item_mystery_toss",
    specials: [
      "длительность: 1",
      "grab_radius: 250",
      "радиус: 275",
      "bonus_damage_pct: 20",
      "grow_bonus_damage_pct: 80",
      "радиус: 1300",
      "урон от броска: 300",
    ],
    cooldown: 2,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 240,
    item_name: "item_mystery_vacuum",
    description: "",
    name: "item_mystery_vacuum",
    specials: ["радиус: 550", "длительность: 0.4", "урон: 160", "радиус: 275"],
    cooldown: 2,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 241,
    item_name: "item_halloween_rapier",
    description: "",
    name: "item_halloween_rapier",
    specials: ["урон: 100"],
    cost: 6200,
    recipe: false,
    notes: [],
  },
  {
    idx: 242,
    item_name: "item_greevil_whistle",
    description:
      "Используйте свисток, чтобы временно превратиться в вашего грявола!",
    name: "item_greevil_whistle",
    specials: ["длительность: 30", "длительность: 2"],
    cooldown: 120,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 243,
    item_name: "item_greevil_whistle_toggle",
    description:
      "Используйте свисток, чтобы переключаться между гряволом и героем!",
    name: "item_greevil_whistle_toggle",
    specials: ["длительность: 30", "длительность: 2"],
    cooldown: 2,
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 244,
    item_name: "item_present",
    description: "",
    name: "A Gift!",
    specials: [],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 245,
    item_name: "item_winter_stocking",
    description: "Использование: загляните в носок, чтобы получить подарки!",
    name: "item_winter_stocking",
    specials: [],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 246,
    item_name: "item_winter_skates",
    description:
      "Повышают скорость передвижения на 100 единиц. Помогают устоять на льду. Для лучшего результата используйте короткие пути!",
    name: "item_winter_skates",
    specials: ["скорость передвижения: 100"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 247,
    item_name: "item_winter_cake",
    description:
      "Используйте кекс, чтобы восстановить 400 ед. здоровья и 50 ед. маны за 8 секунд",
    name: "item_winter_cake",
    specials: ["длительность: 8", "здоровье: 400", "мана: 50"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 248,
    item_name: "item_winter_cookie",
    description:
      "Используйте печенье, чтобы восстановить 350 ед. здоровья и 100 ед. маны за 11 секунд",
    name: "item_winter_cookie",
    specials: ["длительность: 11", "здоровье: 350", "мана: 100"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 249,
    item_name: "item_winter_coco",
    description:
      "Используйте какао, чтобы восстановить 300 ед. здоровья и 150 ед. маны за 14 секунд",
    name: "item_winter_coco",
    specials: ["длительность: 14", "здоровье: 300", "мана: 150"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 250,
    item_name: "item_winter_ham",
    description:
      "Используйте ветчину, чтобы восстановить 300 ед. здоровья и 75 ед. маны за 2 секунды",
    name: "item_winter_ham",
    specials: ["длительность: 2", "здоровье: 300", "мана: 75"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 251,
    item_name: "item_winter_kringle",
    description:
      "Используйте крендель, чтобы восстановить 250 ед. здоровья и 200 ед. маны за 17 секунд",
    name: "item_winter_kringle",
    specials: ["длительность: 17", "здоровье: 250", "мана: 200"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 252,
    item_name: "item_winter_mushroom",
    description: "Обновляет все способности грявола.",
    name: "item_winter_mushroom",
    specials: [],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 253,
    item_name: "item_winter_greevil_treat",
    description:
      "Ваш грявол передвигается на максимальной скорости в течение 10 секунд.",
    name: "item_winter_greevil_treat",
    specials: ["длительность: 10"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 254,
    item_name: "item_winter_greevil_garbage",
    description:
      "Используйте лакомство, чтобы восстановить гряволу 400 ед. здоровья и 150 ед. маны за 5 секунд.",
    name: "item_winter_greevil_garbage",
    specials: ["длительность: 5", "здоровье: 400", "мана: 150"],
    cost: 0,
    recipe: false,
    notes: [],
  },
  {
    idx: 255,
    item_name: "item_winter_greevil_chewy",
    description: "Спустя 2 секунды грявол появляется в новом месте.",
    name: "item_winter_greevil_chewy",
    specials: [],
    cooldown: 10,
    cost: 0,
    recipe: false,
    notes: [],
  },
];
export type ItemKey =
  | "item_blink"
  | "item_blades_of_attack"
  | "item_broadsword"
  | "item_chainmail"
  | "item_claymore"
  | "item_helm_of_iron_will"
  | "item_javelin"
  | "item_mithril_hammer"
  | "item_platemail"
  | "item_quarterstaff"
  | "item_quelling_blade"
  | "item_ring_of_protection"
  | "item_stout_shield"
  | "item_recipe_moon_shard"
  | "item_moon_shard"
  | "item_gauntlets"
  | "item_slippers"
  | "item_mantle"
  | "item_branches"
  | "item_belt_of_strength"
  | "item_boots_of_elves"
  | "item_robe"
  | "item_circlet"
  | "item_ogre_axe"
  | "item_blade_of_alacrity"
  | "item_staff_of_wizardry"
  | "item_ultimate_orb"
  | "item_gloves"
  | "item_lifesteal"
  | "item_ring_of_regen"
  | "item_sobi_mask"
  | "item_boots"
  | "item_gem"
  | "item_cloak"
  | "item_talisman_of_evasion"
  | "item_cheese"
  | "item_magic_stick"
  | "item_recipe_magic_wand"
  | "item_magic_wand"
  | "item_ghost"
  | "item_clarity"
  | "item_enchanted_mango"
  | "item_flask"
  | "item_dust"
  | "item_bottle"
  | "item_ward_observer"
  | "item_ward_sentry"
  | "item_recipe_ward_dispenser"
  | "item_ward_dispenser"
  | "item_tango"
  | "item_tango_single"
  | "item_courier"
  | "item_tpscroll"
  | "item_recipe_travel_boots"
  | "item_recipe_travel_boots_2"
  | "item_travel_boots"
  | "item_travel_boots_2"
  | "item_recipe_phase_boots"
  | "item_phase_boots"
  | "item_demon_edge"
  | "item_eagle"
  | "item_reaver"
  | "item_relic"
  | "item_hyperstone"
  | "item_ring_of_health"
  | "item_void_stone"
  | "item_mystic_staff"
  | "item_energy_booster"
  | "item_point_booster"
  | "item_vitality_booster"
  | "item_recipe_power_treads"
  | "item_power_treads"
  | "item_recipe_hand_of_midas"
  | "item_hand_of_midas"
  | "item_recipe_oblivion_staff"
  | "item_oblivion_staff"
  | "item_recipe_pers"
  | "item_pers"
  | "item_recipe_poor_mans_shield"
  | "item_poor_mans_shield"
  | "item_recipe_bracer"
  | "item_bracer"
  | "item_recipe_wraith_band"
  | "item_wraith_band"
  | "item_recipe_null_talisman"
  | "item_null_talisman"
  | "item_recipe_mekansm"
  | "item_mekansm"
  | "item_recipe_vladmir"
  | "item_vladmir"
  | "item_flying_courier"
  | "item_recipe_buckler"
  | "item_buckler"
  | "item_recipe_ring_of_basilius"
  | "item_ring_of_basilius"
  | "item_recipe_pipe"
  | "item_pipe"
  | "item_recipe_urn_of_shadows"
  | "item_urn_of_shadows"
  | "item_recipe_headdress"
  | "item_headdress"
  | "item_recipe_sheepstick"
  | "item_sheepstick"
  | "item_recipe_orchid"
  | "item_orchid"
  | "item_recipe_cyclone"
  | "item_cyclone"
  | "item_recipe_force_staff"
  | "item_force_staff"
  | "item_recipe_dagon"
  | "item_recipe_dagon_2"
  | "item_recipe_dagon_3"
  | "item_recipe_dagon_4"
  | "item_recipe_dagon_5"
  | "item_dagon"
  | "item_dagon_2"
  | "item_dagon_3"
  | "item_dagon_4"
  | "item_dagon_5"
  | "item_recipe_necronomicon"
  | "item_recipe_necronomicon_2"
  | "item_recipe_necronomicon_3"
  | "item_necronomicon"
  | "item_necronomicon_2"
  | "item_necronomicon_3"
  | "item_recipe_ultimate_scepter"
  | "item_ultimate_scepter"
  | "item_recipe_refresher"
  | "item_refresher"
  | "item_recipe_assault"
  | "item_assault"
  | "item_recipe_heart"
  | "item_heart"
  | "item_recipe_black_king_bar"
  | "item_black_king_bar"
  | "item_aegis"
  | "item_recipe_shivas_guard"
  | "item_shivas_guard"
  | "item_recipe_bloodstone"
  | "item_bloodstone"
  | "item_recipe_sphere"
  | "item_sphere"
  | "item_recipe_lotus_orb"
  | "item_lotus_orb"
  | "item_recipe_vanguard"
  | "item_vanguard"
  | "item_recipe_crimson_guard"
  | "item_crimson_guard"
  | "item_recipe_blade_mail"
  | "item_blade_mail"
  | "item_recipe_soul_booster"
  | "item_soul_booster"
  | "item_recipe_hood_of_defiance"
  | "item_hood_of_defiance"
  | "item_recipe_rapier"
  | "item_rapier"
  | "item_recipe_monkey_king_bar"
  | "item_monkey_king_bar"
  | "item_recipe_radiance"
  | "item_radiance"
  | "item_recipe_butterfly"
  | "item_butterfly"
  | "item_recipe_greater_crit"
  | "item_greater_crit"
  | "item_recipe_basher"
  | "item_basher"
  | "item_recipe_bfury"
  | "item_bfury"
  | "item_recipe_manta"
  | "item_manta"
  | "item_recipe_lesser_crit"
  | "item_lesser_crit"
  | "item_recipe_armlet"
  | "item_armlet"
  | "item_recipe_invis_sword"
  | "item_invis_sword"
  | "item_recipe_silver_edge"
  | "item_silver_edge"
  | "item_recipe_sange_and_yasha"
  | "item_sange_and_yasha"
  | "item_recipe_satanic"
  | "item_satanic"
  | "item_recipe_mjollnir"
  | "item_mjollnir"
  | "item_recipe_skadi"
  | "item_skadi"
  | "item_recipe_sange"
  | "item_sange"
  | "item_recipe_helm_of_the_dominator"
  | "item_helm_of_the_dominator"
  | "item_recipe_maelstrom"
  | "item_maelstrom"
  | "item_recipe_desolator"
  | "item_desolator"
  | "item_recipe_yasha"
  | "item_yasha"
  | "item_recipe_mask_of_madness"
  | "item_mask_of_madness"
  | "item_recipe_diffusal_blade"
  | "item_recipe_diffusal_blade_2"
  | "item_diffusal_blade"
  | "item_diffusal_blade_2"
  | "item_recipe_ethereal_blade"
  | "item_ethereal_blade"
  | "item_recipe_soul_ring"
  | "item_soul_ring"
  | "item_recipe_arcane_boots"
  | "item_arcane_boots"
  | "item_recipe_octarine_core"
  | "item_octarine_core"
  | "item_orb_of_venom"
  | "item_recipe_ancient_janggo"
  | "item_ancient_janggo"
  | "item_recipe_medallion_of_courage"
  | "item_medallion_of_courage"
  | "item_recipe_solar_crest"
  | "item_solar_crest"
  | "item_smoke_of_deceit"
  | "item_recipe_veil_of_discord"
  | "item_veil_of_discord"
  | "item_recipe_guardian_greaves"
  | "item_guardian_greaves"
  | "item_recipe_rod_of_atos"
  | "item_rod_of_atos"
  | "item_recipe_abyssal_blade"
  | "item_abyssal_blade"
  | "item_recipe_heavens_halberd"
  | "item_heavens_halberd"
  | "item_recipe_ring_of_aquila"
  | "item_ring_of_aquila"
  | "item_recipe_tranquil_boots"
  | "item_tranquil_boots"
  | "item_shadow_amulet"
  | "item_recipe_glimmer_cape"
  | "item_glimmer_cape"
  | "item_halloween_candy_corn"
  | "item_mystery_hook"
  | "item_mystery_arrow"
  | "item_mystery_missile"
  | "item_mystery_toss"
  | "item_mystery_vacuum"
  | "item_halloween_rapier"
  | "item_greevil_whistle"
  | "item_greevil_whistle_toggle"
  | "item_present"
  | "item_winter_stocking"
  | "item_winter_skates"
  | "item_winter_cake"
  | "item_winter_cookie"
  | "item_winter_coco"
  | "item_winter_ham"
  | "item_winter_kringle"
  | "item_winter_mushroom"
  | "item_winter_greevil_treat"
  | "item_winter_greevil_garbage"
  | "item_winter_greevil_chewy";
