import { ActionChip } from "@/components/ActionChip";
import { Badge } from "@/components/Badge";
import { BigTabs, IBigTabsProps } from "@/components/BigTabs/BigTabs";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { EmptyState } from "@/components/EmptyState";
import { EmbedProps } from "@/components/EmbedProps";
import { Field } from "@/components/Field";
import { IconButton } from "@/components/IconButton";
import { InfoCardWithIcon } from "@/components/InfoCardWithIcon";
import { Input } from "@/components/Input";
import { Surface } from "@/components/Surface";
import { StatRow } from "@/components/StatRow";
import { Table } from "@/components/Table";
import { SegmentedControl } from "@/components/Tabs";
import { SectionBlock } from "@/components/SectionBlock";
import { threadFont, TrajanPro } from "@/const/fonts";
import { TranslationKey } from "@/TranslationKey";
import cx from "clsx";
import { useState } from "react";
import {
  RiCalendarScheduleLine,
  RiSearchLine,
  RiSettings3Line,
  RiStarLine,
  RiSwordLine,
  RiTeamLine,
} from "react-icons/ri";
import c from "./DesignSystemPage.module.scss";

const tabOptions: TranslationKey[] = [
  "admin_navbar.rules",
  "admin_navbar.settings",
  "admin_navbar.tournament",
];

type DemoBigTab = "overview" | "matches" | "achievements";
type DemoBigItems = IBigTabsProps<DemoBigTab, string>["items"];

const bigTabItems: DemoBigItems = [
  {
    key: "overview",
    label: "Обзор",
    onSelect: () => undefined,
  },
  {
    key: "matches",
    label: "Матчи",
    onSelect: () => undefined,
  },
  {
    key: "achievements",
    label: "Достижения",
    onSelect: () => undefined,
  },
];

const colorSwatches = [
  ["Canvas", "var(--ds-color-bg-canvas)", "--ds-color-bg-canvas"],
  ["Surface", "var(--ds-color-bg-surface)", "--ds-color-bg-surface"],
  ["Elevated", "var(--ds-color-bg-elevated)", "--ds-color-bg-elevated"],
  [
    "Interactive",
    "var(--ds-color-bg-interactive)",
    "--ds-color-bg-interactive",
  ],
  ["Gold", "var(--ds-color-accent-gold)", "--ds-color-accent-gold"],
  ["Red", "var(--ds-color-accent-red)", "--ds-color-accent-red"],
] as const;

const spacingTokens = [
  ["space-1", "4px"],
  ["space-2", "8px"],
  ["space-3", "12px"],
  ["space-4", "16px"],
  ["space-5", "20px"],
  ["space-6", "24px"],
  ["space-7", "32px"],
];

const radiusTokens = [
  ["radius-sm", "4px"],
  ["radius-md", "8px"],
  ["radius-lg", "12px"],
  ["radius-xl", "18px"],
  ["radius-pill", "999px"],
];

export default function DesignSystemPage() {
  const [selectedTab, setSelectedTab] = useState<TranslationKey>(tabOptions[0]);
  const [selectedBigTab, setSelectedBigTab] = useState<DemoBigTab>("overview");
  const [checked, setChecked] = useState(true);

  return (
    <>
      <EmbedProps
        title="Дизайн-система"
        description="Внутренняя справочная страница дизайн-системы для общих UI-компонентов"
      />
      <main className={c.page}>
        <div className={cx(c.shell, threadFont.className)}>
          <section className={c.hero}>
            <h1 className={cx(TrajanPro.className, "megaheading", c.heroTitle)}>
              Дизайн-система
            </h1>
            <p className={c.heroText}>
              Эта страница становится первой каноничной точкой для общих UI-
              токенов и компонентов. Ближайшая цель не в визуальном
              переизобретении, а в консистентности: системные поверхности,
              предсказуемые кнопки, стабильная modal chrome и меньше локальных
              одноразовых правок в feature-модулях. `Trajan` должен оставаться
              шрифтом для hero-моментов и церемониального UI, а не базового
              текста интерфейса.
            </p>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Токены</h2>
            <p className={c.sectionText}>
              Эти семантические значения должны заменить локальные догадки про
              цвета и радиусы. Feature-код по возможности должен использовать
              роли вроде surface, border, accent и muted text вместо сырых
              hex-значений.
            </p>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Цветовые роли</span>
                <div className={c.swatchGrid}>
                  {colorSwatches.map(([name, value, token]) => (
                    <div className={c.swatch} key={token}>
                      <div
                        className={c.swatchSample}
                        style={{ background: value }}
                      />
                      <span className={c.swatchName}>{name}</span>
                      <span className={c.swatchToken}>{token}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Шкалы</span>
                <div className={c.tokenList}>
                  {spacingTokens.map(([name, value]) => (
                    <div className={c.tokenRow} key={name}>
                      <span className={c.tokenName}>{name}</span>
                      <span className={c.tokenValue}>{value}</span>
                    </div>
                  ))}
                  {radiusTokens.map(([name, value]) => (
                    <div className={c.tokenRow} key={name}>
                      <span className={c.tokenName}>{name}</span>
                      <span className={c.tokenValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Поверхности</h2>
            <p className={c.sectionText}>
              Это базовые фоновые слои, на которых должны строиться feature-
              модули, вместо того чтобы каждый раз изобретать новый стиль
              панели.
            </p>
            <div className={c.surfaceGrid}>
              <Surface
                className={cx(c.surfaceCard, c.surfaceCanvas)}
                padding="lg"
                variant="canvas"
              >
                <div>
                  <h3 className={c.surfaceTitle}>Холст</h3>
                  <p className={c.surfaceText}>
                    Используется для фона страницы или самого глубокого слоя
                    layout.
                  </p>
                </div>
                <Button variant="ghost">Действие холста</Button>
              </Surface>
              <Surface
                className={cx(c.surfaceCard, c.surfaceBase)}
                padding="lg"
                variant="surface"
              >
                <div>
                  <h3 className={c.surfaceTitle}>Базовая поверхность</h3>
                  <p className={c.surfaceText}>
                    Стандартная поверхность карточки и тела модального окна.
                  </p>
                </div>
                <Button>Действие поверхности</Button>
              </Surface>
              <Surface
                className={cx(c.surfaceCard, c.surfaceRaised)}
                padding="lg"
                variant="raised"
              >
                <div>
                  <h3 className={c.surfaceTitle}>Поднятая поверхность</h3>
                  <p className={c.surfaceText}>
                    Подходит для контролов и вложенных панелей, которым нужен
                    дополнительный акцент по глубине.
                  </p>
                </div>
                <Button variant="primary">Акцентное действие</Button>
              </Surface>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Кнопки</h2>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Варианты</span>
                <div className={c.buttonStack}>
                  <div className={c.buttonRow}>
                    <Button>Обычная кнопка</Button>
                    <Button variant="primary">Основная кнопка</Button>
                    <Button variant="ghost">Прозрачная кнопка</Button>
                  </div>
                  <Button mega className={c.fullButton}>
                    Мега-кнопка
                  </Button>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Состояния</span>
                <div className={c.buttonStack}>
                  <div className={c.buttonRow}>
                    <Button small>Маленькая кнопка</Button>
                    <Button disabled>Неактивна</Button>
                    <Button variant="ghost" disabled>
                      Неактивная прозрачная
                    </Button>
                  </div>
                  <Button mega disabled className={c.fullButton}>
                    Неактивная мега-кнопка
                  </Button>
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Action Chips</h2>
            <p className={c.sectionText}>
              Маленькие семантические действия для контролов профиля,
              утилитарных операций и компактных сценариев управления. Этот
              паттерн был выделен из `PlayerSummary`.
            </p>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Варианты</span>
                <div className={c.buttonRow}>
                  <ActionChip>Нейтрально</ActionChip>
                  <ActionChip variant="success">Друг</ActionChip>
                  <ActionChip variant="warning">Избегать</ActionChip>
                  <ActionChip variant="danger">Блок</ActionChip>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Активные состояния</span>
                <div className={c.buttonRow}>
                  <ActionChip active variant="success">
                    В друзьях
                  </ActionChip>
                  <ActionChip active variant="warning">
                    В игноре матча
                  </ActionChip>
                  <ActionChip active variant="danger">
                    Заблокирован
                  </ActionChip>
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>
              Навигация и сегментированные переключатели
            </h2>
            <p className={c.sectionText}>
              `BigTabs` остаются первоклассным паттерном. Цель в том, чтобы
              сделать их каноничной семьей для навигации по страницам и
              подразделам. Меньший контрол ниже не является второй равной семьей
              табов, а служит компактным segmented switch для плотных локальных
              сценариев.
            </p>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>BigTabs</span>
                <div className={c.tabsStack}>
                  <div className={c.tabsPreview}>
                    <span className={c.caption}>Размер: small</span>
                    <BigTabs
                      flavor="small"
                      items={bigTabItems.map((item) => ({
                        ...item,
                        onSelect: () => setSelectedBigTab(item.key),
                      }))}
                      selected={selectedBigTab}
                    />
                  </div>
                  <div className={c.tabsPreview}>
                    <span className={c.caption}>Размер: big</span>
                    <BigTabs
                      flavor="big"
                      items={bigTabItems.map((item) => ({
                        ...item,
                        onSelect: () => setSelectedBigTab(item.key),
                      }))}
                      selected={selectedBigTab}
                    />
                  </div>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Segmented Control</span>
                <div className={c.tabsStack}>
                  <SegmentedControl
                    onSelect={setSelectedTab}
                    options={tabOptions}
                    selected={selectedTab}
                  />
                  <p className={c.caption}>
                    Используйте это для локального переключения внутри плотных
                    карточек, мобильных таблиц и компактных зон управления. Не
                    используйте как навигацию уровня страницы.
                  </p>
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Типографика</h2>
            <p className={c.sectionText}>
              Роли шрифтов должны быть зафиксированы явно. `Trajan` это display-
              голос для hero-заголовков, наградных моментов и церемониальных
              акцентов. Повседневный текст, контролы, labels и helper text
              должны оставаться на body-font, чтобы интерфейсы были читаемыми и
              консистентными.
            </p>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Роли</span>
                <div className={c.typeStack}>
                  <h1 className={cx(TrajanPro.className, c.display)}>
                    Большой акцентный заголовок
                  </h1>
                  <h2 className={c.heading}>Заголовок секции</h2>
                  <h3 className={c.subheading}>Подзаголовок / eyebrow</h3>
                  <p className={c.body}>
                    Основной текст, labels, tabs, helper text, строки настроек и
                    form controls должны использовать body-font. Display-
                    типографика должна быть исключением, а не базой.
                  </p>
                  <p className={c.caption}>
                    Caption-текст подходит для пояснений, приглушенных
                    метаданных и заметок с низким визуальным приоритетом.
                  </p>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Правила использования</span>
                <div className={c.typeStack}>
                  <div className={c.ruleList}>
                    <div className={c.ruleRow}>
                      <span className={c.ruleTitle}>
                        Использовать `Trajan` для
                      </span>
                      <span className={c.ruleText}>
                        Hero-заголовков, наградных callout-блоков, мега-кнопок,
                        feature-промо и церемониальных заголовков.
                      </span>
                    </div>
                    <div className={c.ruleRow}>
                      <span className={c.ruleTitle}>
                        Использовать body-font для
                      </span>
                      <span className={c.ruleText}>
                        Tabs, inputs, settings, tables, chips, cards, helper
                        copy и всего плотного или интерактивного UI.
                      </span>
                    </div>
                    <div className={c.ruleRow}>
                      <span className={c.ruleTitle}>Избегать</span>
                      <span className={c.ruleText}>
                        Целых экранов, где каждый заголовок, карточка и абзац
                        внезапно оказываются в `Trajan`, потому что это уплощает
                        иерархию и ухудшает читаемость.
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Layout-паттерны</h2>
            <p className={c.sectionText}>
              Это повторяющиеся оболочки уровня страницы и карточки, которые
              постоянно встречаются в feature-модулях. Их стоит зафиксировать
              здесь до того, как мы начнем выделять более конкретные компоненты.
            </p>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>SectionBlock</span>
                <div className={c.patternStack}>
                  <SectionBlock
                    actions={
                      <Button small variant="ghost">
                        Управлять
                      </Button>
                    }
                    title="История матчей и статистика игрока"
                    variant="default"
                  >
                    <div className={c.sectionBlockDemo}>
                      <p className={c.sectionHeaderText}>
                        Каноничная оболочка секции: заголовок, actions справа и
                        свободная контентная область внутри.
                      </p>
                      <div className={c.badgeRow}>
                        <Badge variant="green">Активно</Badge>
                        <Badge variant="blue">Обновлено</Badge>
                      </div>
                    </div>
                  </SectionBlock>
                  <SectionBlock title="Короткий простой блок" variant="simple">
                    <div className={c.sectionBlockDemo}>
                      <p className={c.sectionHeaderText}>
                        Вариант `simple` полезен там, где нужен тот же каркас,
                        но без тяжелой тени.
                      </p>
                    </div>
                  </SectionBlock>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Section Header</span>
                <div className={c.patternStack}>
                  <div className={c.sectionHeaderPreview}>
                    <div className={c.sectionHeaderMeta}>
                      <span className={c.sectionEyebrow}>
                        Инструменты профиля
                      </span>
                      <h3 className={c.sectionHeroTitle}>Настройки профиля</h3>
                      <p className={c.sectionHeaderText}>
                        Переиспользуемый вводный блок для страниц и крупных
                        панелей: eyebrow, заголовок, поясняющий текст и
                        необязательное действие справа.
                      </p>
                    </div>
                    <Button variant="ghost">Вторичное действие</Button>
                  </div>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Toolbar Row</span>
                <div className={c.patternStack}>
                  <div className={c.toolbarPreview}>
                    <Input placeholder="Поиск игроков или лобби" />
                    <div className={c.buttonRow}>
                      <Button small>Обновить</Button>
                      <Button small variant="ghost">
                        Фильтры
                      </Button>
                    </div>
                  </div>
                  <p className={c.caption}>
                    Частый паттерн верхней панели: поиск слева, компактные
                    действия справа.
                  </p>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Empty State</span>
                <div className={c.patternStack}>
                  <EmptyState
                    actions={<Button>Открыть очередь модерации</Button>}
                    className={c.emptyState}
                    description="Пустое состояние тоже должно выглядеть собранно: короткий заголовок, одно понятное объяснение и одно очевидное следующее действие."
                    title="Нет активных жалоб"
                  />
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Split Info Card</span>
                <div className={c.patternStack}>
                  <Surface
                    className={c.splitCard}
                    padding="lg"
                    variant="surface"
                  >
                    <div className={c.splitCardMeta}>
                      <span className={c.sectionEyebrow}>DotaClassic Plus</span>
                      <h3 className={c.splitCardTitle}>Награды подписки</h3>
                      <p className={c.sectionHeaderText}>
                        Этот паттерн подходит для наград, апсейлов и акцентных
                        карточек профиля: медиа-зона с одной стороны, контент и
                        CTA с другой.
                      </p>
                    </div>
                    <Badge variant="yellow">Превью</Badge>
                  </Surface>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Info Cards</span>
                <div className={c.infoCardGrid}>
                  <InfoCardWithIcon
                    icon={<RiSwordLine />}
                    title="Формат"
                    text="Single elimination, Captains Mode"
                  />
                  <InfoCardWithIcon
                    icon={<RiCalendarScheduleLine />}
                    title="Окно готовности"
                    text="За 60 минут до старта турнира"
                  />
                  <InfoCardWithIcon
                    icon={<RiTeamLine />}
                    title="Размер команды"
                    text="5 игроков в составе"
                  />
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Формы и контролы</h2>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Badges</span>
                <div className={c.badgeRow}>
                  <Badge variant="green">Готово</Badge>
                  <Badge variant="yellow">В очереди</Badge>
                  <Badge variant="blue">Инфо</Badge>
                  <Badge variant="grey">Черновик</Badge>
                  <Badge variant="red">Заблокирован</Badge>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Inputs</span>
                <div className={c.inputStack}>
                  <Input placeholder="Поиск игрока" />
                  <Input defaultValue="Психология Профессор" />
                  <span className={c.inputHelp}>
                    Каноничный input должен использовать системные радиусы,
                    рамки и hover/focus-состояния.
                  </span>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Field Wrapper</span>
                <div className={c.inputStack}>
                  <Field
                    hint="Показывается под label как короткое пояснение."
                    label="Имя игрока"
                  >
                    <Input defaultValue="Психология Профессор" />
                  </Field>
                  <Field
                    hint="Горизонтальный layout удобен для коротких строк."
                    label="Название лобби"
                    layout="horizontal"
                  >
                    <Input defaultValue="Тренировка 1x1 mid only" />
                  </Field>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Checkboxes</span>
                <div className={c.checkRow}>
                  <Checkbox checked={checked} onChange={setChecked}>
                    Включить экспериментальный интерфейс
                  </Checkbox>
                  <Checkbox checked={false} onChange={() => undefined}>
                    Подписаться на уведомления
                  </Checkbox>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Icon Buttons</span>
                <div className={c.iconRow}>
                  <IconButton className={c.iconButtonDemo}>
                    <RiSearchLine />
                  </IconButton>
                  <IconButton className={c.iconButtonDemo}>
                    <RiSettings3Line />
                  </IconButton>
                  <IconButton className={c.iconButtonDemo}>
                    <RiStarLine />
                  </IconButton>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Modal Chrome</span>
                <div className={c.modalPreview}>
                  <div className={c.modalHeader}>
                    <span>Базовая оболочка модального окна</span>
                    <Button className={c.closeGhost} variant="ghost">
                      ×
                    </Button>
                  </div>
                  <div className={c.modalBody}>
                    <span>
                      Этот пример показывает желаемое направление для modal
                      chrome: системная поверхность, рамка, отступы и обработка
                      header-зоны.
                    </span>
                    <Button>Подтвердить</Button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className={c.section}>
            <h2 className={c.sectionTitle}>Отображение данных</h2>
            <div className={c.grid}>
              <article className={c.card}>
                <span className={c.label}>Table</span>
                <div className={c.tableWrap}>
                  <Table className="compact">
                    <thead>
                      <tr>
                        <th>Игрок</th>
                        <th className="middle">MMR</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Психология Профессор</td>
                        <td className="middle">5210</td>
                        <td>
                          <Badge variant="green">В сети</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>RX</td>
                        <td className="middle">4875</td>
                        <td>
                          <Badge variant="yellow">В очереди</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td>Itachi</td>
                        <td className="middle">6124</td>
                        <td>
                          <Badge variant="blue">Редактирует</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Status Rows</span>
                <div className={c.statusList}>
                  <div className={c.statusRow}>
                    <div className={c.statusMeta}>
                      <span className={c.statusTitle}>Ранговый поиск</span>
                      <span className={c.statusText}>
                        Унифицированный статусный ряд для списков, настроек и
                        административных панелей.
                      </span>
                    </div>
                    <Badge variant="green">Активно</Badge>
                  </div>
                  <div className={c.statusRow}>
                    <div className={c.statusMeta}>
                      <span className={c.statusTitle}>Загрузка патча</span>
                      <span className={c.statusText}>
                        Та же оболочка, но другое состояние и другой смысл.
                      </span>
                    </div>
                    <Badge variant="yellow">Ожидает</Badge>
                  </div>
                  <div className={c.statusRow}>
                    <div className={c.statusMeta}>
                      <span className={c.statusTitle}>
                        Синхронизация модерации
                      </span>
                      <span className={c.statusText}>
                        Подходит для admin-экранов и dashboard-представлений.
                      </span>
                    </div>
                    <Badge variant="red">Ошибка</Badge>
                  </div>
                </div>
              </article>

              <article className={c.card}>
                <span className={c.label}>Stat Rows / Key Value</span>
                <div className={c.statusList}>
                  <div className={c.statusRow}>
                    <StatRow
                      label="Матчи"
                      value={
                        <>
                          <span className="green">128</span>
                          <span className="red">74</span>
                          <span className="grey">3</span>
                        </>
                      }
                    />
                    <StatRow
                      label="Винрейт"
                      value="63%"
                      valueClassName="green"
                    />
                    <StatRow label="Рейтинг" value="5210" />
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
