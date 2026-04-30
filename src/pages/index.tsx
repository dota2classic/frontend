import { BlogPageDto, TwitchStreamDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { BlogPostCard } from "@/components/BlogPostCard";
import { Button } from "@/components/Button";
import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { TrajanPro, threadFont } from "@/const/fonts";
import { AppRouter } from "@/route";
import { getDomain } from "@/util/domain";
import cx from "clsx";
import { useEffect, useState } from "react";
import c from "./dev/Landing3Page.module.scss";

interface HomeProps {
  blog: BlogPageDto;
  streams: TwitchStreamDto[];
}

type PatchState = "past" | "active" | "next" | "unknown";

interface PatchData {
  num: string;
  name: string;
  desc: string;
  state: PatchState;
  dateRange?: string;
}

const patches: PatchData[] = [
  {
    num: "6.81",
    name: "Классика",
    desc: "Сбалансированная мета, любимый патч старожилов.",
    state: "past",
  },
  {
    num: "6.84c",
    name: "Предыдущий сезон",
    desc: "Балансный патч, где начиналась классика на новых серверах.",
    state: "past",
  },
  {
    num: "6.84d",
    name: "Текущий сезон",
    desc: "Активный сезон — серверы работают, очереди живые.",
    state: "active",
    dateRange: "1 мая – 1 сентября 2026",
  },
  {
    num: "?",
    name: "Следующий патч",
    desc: "Что-то новое готовится. Следи за новостями.",
    state: "next",
    dateRange: "1 сентября – 1 января 2027",
  },
  {
    num: "??",
    name: "Далёкая дорога",
    desc: "Планы ещё на этапе идей. Чего ждать — вопрос времени.",
    state: "unknown",
  },
];

const statLinks = [
  {
    link: AppRouter.players.leaderboard(),
    img: "/landing/leaderboard.webp",
    title: "Рейтинг игроков",
    desc: "Лучшие на сервере",
  },
  {
    link: AppRouter.matches.index(),
    img: "/landing/wallpaper-heroes.webp",
    title: "История матчей",
    desc: "Разбор каждой игры",
  },
  {
    link: AppRouter.heroes.index,
    img: "/landing/invoker.webp",
    title: "Сила героев",
    desc: "Мета и винрейт",
  },
];

const PATCH_BADGE: Record<PatchState, string | null> = {
  past: "ЗАВЕРШЁН",
  active: "СЕЙЧАС",
  next: "СКОРО",
  unknown: null,
};

function DownloadIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TwitchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

export default function Home({ blog, streams }: HomeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const twitchChannel =
    streams[0]?.link.split("twitch.tv/")[1] ?? "dotaclassic_live";
  const domain = mounted ? getDomain() : "dotaclassic.ru";

  const posts = blog.data.slice(0, 3);

  return (
    <>
      <EmbedProps
        title="DotaClassic — Настоящая Dota 2"
        description="Оригинальные патчи, старая карта, живой онлайн. Скачай лаунчер и начни играть уже сегодня."
      />
      <div className={cx(c.page, threadFont.className)}>
        {/* ── HERO ── */}
        <section className={c.hero}>
          <video
            className={c.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            src="/landing/output_action.webm"
          />
          <div className={c.heroOverlay} />

          <div className={c.heroContent}>
            <h1 className={cx(c.heroTitle, TrajanPro.className)}>
              Настоящая
              <br />
              <span className={c.heroTitleAccent}>Dota 2</span>
            </h1>

            <p className={c.heroSub}>
              Классические патчи, старая карта, адекватные герои.
              Сбалансированный урон и здоровье героев, каждая способность -
              важная.
            </p>

            <div className={c.heroActions}>
              <Button
                pageLink={AppRouter.download.link}
                variant="landingPrimary"
              >
                <DownloadIcon />
                Скачать лаунчер — бесплатно
              </Button>
            </div>

            <p className={c.heroFreeNote}>
              Бесплатно навсегда ·{" "}
              <span className={c.heroFreeNoteAccent}>35 000+ игроков</span>
            </p>
          </div>
        </section>

        {/* ── КАК ЭТО РАБОТАЕТ ── */}
        <div className={c.sectionSurface}>
          <div className={c.sectionInner}>
            <div className={c.sectionHeader}>
              <span className={c.sectionTag}>Устройство</span>
              <h2 className={c.sectionTitle}>Как это работает</h2>
              <p className={c.sectionDesc}>
                Мы берём оригинальные клиенты Dota 2 разных патчей, модифицируем
                их для удобства и стабильности, запускаем собственные игровые
                серверы. Лаунчер подключает игру к нашему матчмейкингу — так ты
                играешь в классику, а не в актуальную Доту.
              </p>
            </div>

            <div className={c.howItWorksGrid}>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>1</div>
                <h3 className={c.howItWorksTitle}>Классические клиенты</h3>
                <p className={c.howItWorksText}>
                  Оригинальные версии Dota 2 с модификациями для стабильности
                </p>
              </div>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>2</div>
                <h3 className={c.howItWorksTitle}>Свои серверы</h3>
                <p className={c.howItWorksText}>
                  Собственная инфраструктура для матчей
                </p>
              </div>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>3</div>
                <h3 className={c.howItWorksTitle}>Лаунчер</h3>
                <p className={c.howItWorksText}>
                  Ищешь игру через лаунчер, не через саму Доту. Так
                  подключаешься к нашему матчмейкингу
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRICS ── */}
        <div className={c.metricsBar}>
          <div className={c.metric}>
            <div className={c.metricValue}>
              35<span className={c.metricValueAccent}>K</span>+
            </div>
            <div className={c.metricLabel}>Зарегистрировано игроков</div>
          </div>
          <div className={c.metric}>
            <div className={c.metricValue}>
              56<span className={c.metricValueAccent}>K</span>+
            </div>
            <div className={c.metricLabel}>Сыграно матчей</div>
          </div>
          <div className={c.metric}>
            <div className={c.metricValue}>
              165<span className={c.metricValueAccent}>K</span>
            </div>
            <div className={c.metricLabel}>Часов в игре</div>
          </div>
        </div>

        {/* ── PATCHES ── */}
        <section className={c.section}>
          <div className={c.sectionHeader}>
            <span className={c.sectionTag}>Контент</span>
            <h2 className={c.sectionTitle}>Ротация патчей</h2>
            <p className={c.sectionDesc}>
              Периодически меняем доступные версии. Сейчас в очереди:
            </p>
          </div>
          <div className={c.patchesGrid}>
            {patches.map((p) => (
              <div
                key={p.num}
                className={cx(
                  c.patchCard,
                  p.state === "past" && c.patchCardPast,
                  p.state === "active" && c.patchCardActive,
                  p.state === "next" && c.patchCardNext,
                  p.state === "unknown" && c.patchCardUnknown,
                )}
              >
                {PATCH_BADGE[p.state] && (
                  <span
                    className={cx(
                      c.patchBadge,
                      p.state === "past" && c.patchBadgePast,
                      p.state === "active" && c.patchBadgeActive,
                      p.state === "next" && c.patchBadgeNext,
                    )}
                  >
                    {PATCH_BADGE[p.state]}
                  </span>
                )}
                {p.dateRange && (
                  <span className={c.patchDateBadge}>{p.dateRange}</span>
                )}
                <div
                  className={cx(
                    c.patchNumber,
                    p.state === "unknown" && c.patchNumberUnknown,
                  )}
                >
                  {p.num}
                </div>
                <div className={c.patchName}>{p.name}</div>
                <div className={c.patchDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STREAMS ── */}
        <div className={c.sectionSurface}>
          <div className={c.sectionInner}>
            <div className={c.sectionHeader}>
              <span className={c.sectionTag}>Онлайн</span>
              <h2 className={c.sectionTitle}>Сейчас в эфире</h2>
              <p className={c.sectionDesc}>
                Стримеры, которые играют прямо сейчас
              </p>
            </div>

            {mounted ? (
              <>
                <iframe
                  className={c.twitchEmbed}
                  src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${domain}&autoplay=false`}
                  allowFullScreen
                />
                <div className={c.twitchMeta}>
                  <a
                    href={`https://www.twitch.tv/${twitchChannel}`}
                    target="_blank"
                    rel="noreferrer"
                    className={c.btnSecondary}
                  >
                    <TwitchIcon />
                    Смотреть на Twitch
                  </a>
                </div>
              </>
            ) : (
              <div
                className={c.twitchEmbed}
                style={{ background: "#0e0f1a" }}
              />
            )}

            {streams.length > 1 && (
              <div className={c.streamCards} style={{ marginTop: 24 }}>
                {streams.slice(1).map((s) => (
                  <a
                    key={s.link}
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    className={c.streamCard}
                  >
                    <div className={c.streamThumb}>
                      {s.preview && (
                        <img
                          className={c.streamThumbImg}
                          src={s.preview
                            .replace("{width}", "480")
                            .replace("{height}", "270")}
                          alt={s.title}
                          loading="lazy"
                        />
                      )}
                      <span className={c.streamLiveBadge}>
                        <span className={c.pulseDot} />
                        LIVE
                      </span>
                      <span className={c.streamViewersCount}>
                        {s.viewers.toLocaleString("ru-RU")} зрителей
                      </span>
                    </div>
                    <div className={c.streamInfo}>
                      <div className={c.streamName}>
                        {s.link.split("twitch.tv/")[1]}
                      </div>
                      {s.title && <div className={c.streamGame}>{s.title}</div>}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── NEWS ── */}
        <section className={c.section}>
          <div className={c.sectionHeaderRow}>
            <div>
              <span className={c.sectionTag}>Новости</span>
              <h2 className={c.sectionTitle}>Что нового</h2>
            </div>
            <PageLink
              link={AppRouter.blog.index.link}
              className={c.sectionAllLink}
            >
              Все новости →
            </PageLink>
          </div>

          {posts.length > 0 && (
            <div className={c.newsGrid}>
              {posts.map((post, i) => (
                <BlogPostCard
                  key={post.id}
                  href={
                    AppRouter.blog.post(post.id).link.as ?? `/blog/${post.id}`
                  }
                  title={post.title}
                  date={new Date(post.publishDate).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  description={post.shortDescription}
                  imageUrl={post.image?.url}
                  featured={i === 0}
                  showDescription={i === 0}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── STAT LINKS ── */}
        <div className={c.sectionSurface}>
          <div className={c.sectionInner}>
            <div className={c.sectionHeader}>
              <span className={c.sectionTag}>Статистика</span>
              <h2 className={c.sectionTitle}>Изучай игру</h2>
            </div>
            <div className={c.statLinksGrid}>
              {statLinks.map((sl) => (
                <PageLink
                  key={sl.title}
                  link={sl.link.link}
                  className={c.statLinkCard}
                >
                  <div className={c.statLinkImg}>
                    <img src={sl.img} alt={sl.title} loading="lazy" />
                  </div>
                  <div className={c.statLinkText}>
                    <div className={c.statLinkTitle}>{sl.title}</div>
                    <div className={c.statLinkDesc}>{sl.desc}</div>
                  </div>
                  <span className={c.statLinkArrow}>→</span>
                </PageLink>
              ))}
            </div>
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div className={c.finalCta}>
          <div className={c.finalCtaBg} />
          <div className={c.finalCtaOverlay} />
          <div className={c.finalCtaContent}>
            <h2 className={cx(c.finalCtaTitle, TrajanPro.className)}>
              Время вернуться
            </h2>
            <p className={c.finalCtaDesc}>
              Скачай лаунчер и начни играть прямо сейчас. Нужен только Steam.
            </p>
            <Button
              pageLink={AppRouter.download.link}
              variant="landingPrimary"
              large
            >
              <DownloadIcon />
              Скачать лаунчер
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

Home.layoutConfig = { fullBleed: true };

Home.getInitialProps = async (): Promise<HomeProps> => {
  const [blog, streams] = await Promise.all([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi()
      .statsApi.statsControllerGetTwitchStreams()
      .catch(() => [] as TwitchStreamDto[]),
  ]);
  return { blog, streams };
};
