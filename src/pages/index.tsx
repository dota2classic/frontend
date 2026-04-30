import { BlogPageDto, CurrentOnlineDto, TwitchStreamDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { BlogPostCard } from "@/components/BlogPostCard";
import { Button } from "@/components/Button";
import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { TelegramInvite } from "@/components/TelegramInvite";
import { TrajanPro, threadFont } from "@/const/fonts";
import { AppRouter } from "@/route";
import { getDomain } from "@/util/domain";
import cx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import c from "./index.module.scss";

interface HomeProps {
  blog: BlogPageDto;
  streams: TwitchStreamDto[];
  online: CurrentOnlineDto | null;
}

type PatchState = "past" | "active" | "next" | "unknown";

interface PatchData {
  num: string;
  name: string;
  desc: string;
  state: PatchState;
  dateRange?: string;
}

const getPatches = (t: ReturnType<typeof useTranslation>["t"]): PatchData[] => [
  {
    num: "6.84c",
    name: t("landing.patches.season684c"),
    desc: t("landing.patches.season684cDesc"),
    state: "past",
  },
  {
    num: "6.84d",
    name: t("landing.patches.season684d"),
    desc: t("landing.patches.season684dDesc"),
    state: "active",
    dateRange: t("landing.patches.season684dDateRange"),
  },
  {
    num: "?",
    name: t("landing.patches.nextPatch"),
    desc: t("landing.patches.nextPatchDesc"),
    state: "next",
    dateRange: t("landing.patches.nextPatchDateRange"),
  },
];

const getStatLinks = (t: ReturnType<typeof useTranslation>["t"]) => [
  {
    link: AppRouter.players.leaderboard(),
    img: "/landing/leaderboard.webp",
    title: t("landing.stats.leaderboard"),
    desc: t("landing.stats.leaderboardDesc"),
  },
  {
    link: AppRouter.matches.index(),
    img: "/landing/wallpaper-heroes.webp",
    title: t("landing.stats.matchHistory"),
    desc: t("landing.stats.matchHistoryDesc"),
  },
  {
    link: AppRouter.heroes.index,
    img: "/landing/invoker.webp",
    title: t("landing.stats.heroesStats"),
    desc: t("landing.stats.heroesStatsDesc"),
  },
];

const getPATCH_BADGE = (
  t: ReturnType<typeof useTranslation>["t"],
): Record<PatchState, string | null> => ({
  past: t("landing.patches.badgePast"),
  active: t("landing.patches.badgeActive"),
  next: t("landing.patches.badgeNext"),
  unknown: null,
});

const getFaqs = (
  t: ReturnType<typeof useTranslation>["t"],
): { q: string; a: string }[] => [
  {
    q: t("landing.faq.q1"),
    a: t("landing.faq.a1"),
  },
  {
    q: t("landing.faq.q2"),
    a: t("landing.faq.a2"),
  },
  {
    q: t("landing.faq.q3"),
    a: t("landing.faq.a3"),
  },
  {
    q: t("landing.faq.q4"),
    a: t("landing.faq.a4"),
  },
  {
    q: t("landing.faq.q5"),
    a: t("landing.faq.a5"),
  },
];

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
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function TwitchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

export default function Home({ blog, streams, online }: HomeProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const twitchChannel = streams[0]?.link.split("twitch.tv/")[1];
  const domain = mounted ? getDomain() : "dotaclassic.ru";
  const patches = getPatches(t);
  const statLinks = getStatLinks(t);
  const PATCH_BADGE = getPATCH_BADGE(t);
  const faqs = getFaqs(t);

  const posts = blog.data.slice(0, 3);

  return (
    <>
      <EmbedProps
        title={t("landing.meta.title")}
        description={t("landing.meta.description")}
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
            preload="metadata"
            poster="/landing/dotaold.webp"
            aria-hidden="true"
            src="/landing/output_action.webm"
          />
          <div className={c.heroOverlay} />

          <div className={c.heroContent}>
            <h1 className={cx(c.heroTitle, TrajanPro.className)}>
              {t("landing.hero.titleLine1")}
              <br />
              <span className={c.heroTitleAccent}>
                {t("landing.hero.titleLine2")}
              </span>
            </h1>

            <p className={c.heroSub}>{t("landing.hero.subtitle")}</p>

            <div className={c.heroActions}>
              <Button
                pageLink={AppRouter.download.link}
                variant="landingPrimary"
              >
                <DownloadIcon />
                {t("landing.hero.downloadBtn")}
              </Button>
              <PageLink
                link={AppRouter.matches.live.link}
                className={c.heroSecondary}
              >
                <PlayIcon />
                {t("landing.hero.liveMatchesBtn")}
              </PageLink>
            </div>

            <p className={c.heroFreeNote}>
              {t("landing.hero.freeNote")} ·{" "}
              <span className={c.heroFreeNoteAccent}>
                {t("landing.hero.playersCount")}
              </span>
            </p>
          </div>
        </section>

        {/* ── КАК НАЧАТЬ ── */}
        <div className={c.sectionSurface}>
          <div className={c.sectionInner}>
            <div className={c.sectionHeader}>
              <span className={c.sectionTag}>
                {t("landing.howItWorks.tag")}
              </span>
              <h2 className={c.sectionTitle}>
                {t("landing.howItWorks.title")}
              </h2>
              <p className={c.sectionDesc}>
                {t("landing.howItWorks.subtitle")}
              </p>
            </div>

            <div className={c.howItWorksGrid}>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>1</div>
                <h3 className={c.howItWorksTitle}>
                  {t("landing.howItWorks.step1Title")}
                </h3>
                <p className={c.howItWorksText}>
                  {t("landing.howItWorks.step1Text")}
                </p>
              </div>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>2</div>
                <h3 className={c.howItWorksTitle}>
                  {t("landing.howItWorks.step2Title")}
                </h3>
                <p className={c.howItWorksText}>
                  {t("landing.howItWorks.step2Text")}
                </p>
              </div>
              <div className={c.howItWorksCard}>
                <div className={c.howItWorksNumber}>3</div>
                <h3 className={c.howItWorksTitle}>
                  {t("landing.howItWorks.step3Title")}
                </h3>
                <p className={c.howItWorksText}>
                  {t("landing.howItWorks.step3Text")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRICS ── */}
        <div className={c.metricsBar}>
          <div className={c.metric}>
            <div className={c.metricValue}>
              {t("landing.metrics.registeredValue")}
              <span className={c.metricValueAccent}></span>
            </div>
            <div className={c.metricLabel}>
              {t("landing.metrics.registeredPlayers")}
            </div>
          </div>
          <div className={c.metric}>
            <div className={c.metricValue}>
              {t("landing.metrics.gamesPlayedValue")}
              <span className={c.metricValueAccent}></span>
            </div>
            <div className={c.metricLabel}>
              {t("landing.metrics.gamesPlayed")}
            </div>
          </div>
          {online ? (
            <div className={c.metric}>
              <div className={c.metricValue}>
                {online.inGame.toLocaleString("ru-RU")}
                <span className={cx(c.metricValueAccent, c.metricLive)}>
                  <span className={c.pulseDot} aria-hidden="true" />
                </span>
              </div>
              <div className={c.metricLabel}>
                {t("landing.metrics.onlineNow")}
              </div>
            </div>
          ) : (
            <div className={c.metric}>
              <div className={c.metricValue}>
                {t("landing.metrics.hoursPlayedValue")}
                <span className={c.metricValueAccent}></span>
              </div>
              <div className={c.metricLabel}>
                {t("landing.metrics.hoursPlayed")}
              </div>
            </div>
          )}
        </div>

        {/* ── PATCHES ── */}
        <section className={c.section}>
          <div className={c.sectionHeader}>
            <span className={c.sectionTag}>{t("landing.patches.tag")}</span>
            <h2 className={c.sectionTitle}>{t("landing.patches.title")}</h2>
            <p className={c.sectionDesc}>{t("landing.patches.subtitle")}</p>
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
        {twitchChannel && (
          <div className={c.sectionSurface}>
            <div className={c.sectionInner}>
              <div className={c.sectionHeader}>
                <span className={c.sectionTag}>{t("landing.streams.tag")}</span>
                <h2 className={c.sectionTitle}>{t("landing.streams.title")}</h2>
                <p className={c.sectionDesc}>{t("landing.streams.subtitle")}</p>
              </div>

              {mounted ? (
                <>
                  <iframe
                    className={c.twitchEmbed}
                    title={`Twitch-стрим ${twitchChannel}`}
                    src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${domain}&autoplay=false`}
                    allowFullScreen
                    loading="lazy"
                  />
                  <div className={c.twitchMeta}>
                    <a
                      href={`https://www.twitch.tv/${twitchChannel}`}
                      target="_blank"
                      rel="noreferrer"
                      className={c.btnSecondary}
                    >
                      <TwitchIcon />
                      {t("landing.streams.watchOnTwitch")}
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
                          {t("landing.streams.live")}
                        </span>
                        <span className={c.streamViewersCount}>
                          {s.viewers.toLocaleString("ru-RU")}{" "}
                          {t("landing.streams.viewers")}
                        </span>
                      </div>
                      <div className={c.streamInfo}>
                        <div className={c.streamName}>
                          {s.link.split("twitch.tv/")[1]}
                        </div>
                        {s.title && (
                          <div className={c.streamGame}>{s.title}</div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── NEWS ── */}
        <section className={c.section}>
          <div className={c.sectionHeaderRow}>
            <div>
              <span className={c.sectionTag}>{t("landing.news.tag")}</span>
              <h2 className={c.sectionTitle}>{t("landing.news.title")}</h2>
            </div>
            <PageLink
              link={AppRouter.blog.index.link}
              className={c.sectionAllLink}
            >
              {t("landing.news.allNews")}
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
              <span className={c.sectionTag}>{t("landing.stats.tag")}</span>
              <h2 className={c.sectionTitle}>{t("landing.stats.title")}</h2>
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

        {/* ── FAQ ── */}
        <section className={c.section}>
          <div className={c.sectionHeader}>
            <span className={c.sectionTag}>{t("landing.faq.tag")}</span>
            <h2 className={c.sectionTitle}>{t("landing.faq.title")}</h2>
          </div>
          <div className={c.faqList}>
            {faqs.map((f) => (
              <details key={f.q} className={c.faqItem}>
                <summary className={c.faqQuestion}>
                  <span>{f.q}</span>
                  <span className={c.faqIcon} aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className={c.faqAnswer}>{f.a}</div>
              </details>
            ))}
          </div>
          <p className={c.faqNudge}>
            {t("landing.faq.nudge")}{" "}
            <TelegramInvite className={c.faqNudgeLink} />
          </p>
        </section>

        {/* ── FINAL CTA ── */}
        <div className={c.finalCta}>
          <div className={c.finalCtaBg} />
          <div className={c.finalCtaOverlay} />
          <div className={c.finalCtaContent}>
            <h2 className={cx(c.finalCtaTitle, TrajanPro.className)}>
              {t("landing.finalCta.title")}
            </h2>
            <p className={c.finalCtaDesc}>{t("landing.finalCta.subtitle")}</p>
            <Button
              pageLink={AppRouter.download.link}
              variant="landingPrimary"
              large
            >
              <DownloadIcon />
              {t("landing.finalCta.downloadBtn")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

Home.layoutConfig = { fullBleed: true };

Home.getInitialProps = async (): Promise<HomeProps> => {
  const [blog, streams, online] = await Promise.all([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi()
      .statsApi.statsControllerGetTwitchStreams()
      .catch(() => [] as TwitchStreamDto[]),
    getApi()
      .statsApi.statsControllerOnline()
      .catch(() => null),
  ]);
  return { blog, streams, online };
};
