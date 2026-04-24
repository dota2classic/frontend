import { BlogPageDto, TwitchStreamDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components/EmbedProps";
import { TrajanPro, threadFont } from "@/const/fonts";
import { AppRouter } from "@/route";
import { getDomain } from "@/util/domain";
import cx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import c from "./LandingProPage.module.scss";

interface LandingProPageProps {
  blog: BlogPageDto;
  streams: TwitchStreamDto[];
}

const features = [
  {
    label: "Альтернатива",
    title: "Надоела текущая Dota? Вот выход",
    text: "Хочется доты, но новый патч не заходит — заходи сюда. Та же игра, другой баланс. Реальная альтернатива, а не музейный экспонат.",
  },
  {
    label: "Режимы",
    title: "Режим под любое настроение",
    text: "Хочешь размяться — иди против ботов. Есть 20 минут — турбо. Готов к серьёзной игре — полноценное 5×5 с рейтингом.",
  },
  {
    label: "Комьюнити",
    title: "Все друг друга знают",
    text: "Комьюнити компактное — и это плюс. Здесь быстро появляются постоянные тиммейты, знакомые лица и своя атмосфера.",
  },
];

const steps = [
  {
    index: "01",
    title: "Скачай лаунчер",
    text: "Переходи по ссылке и скачивай установщик. Займёт меньше минуты.",
  },
  {
    index: "02",
    title: "Лаунчер установит игру сам",
    text: "Запусти лаунчер — он сам скачает и установит клиент. Ничего настраивать вручную не нужно.",
  },
  {
    index: "03",
    title: "Найди матч прямо в лаунчере",
    text: "Жми поиск игры в лаунчере и заходи в свой первый онлайн матч. Без лишних шагов.",
  },
];

const channels = [
  {
    label: "Статистика",
    title: "Рейтинг и мета",
    text: "Таблица лучших игроков, статистика по героям и тренды текущего патча — всё в одном месте.",
    href: AppRouter.meta.index.link,
    action: "Открыть рейтинг",
    image: "/landing/leaderboard.webp",
  },
  {
    label: "Блог",
    title: "Новости проекта",
    text: "Обновления сервера, события и анонсы — чтобы понимать, что происходит прямо сейчас.",
    href: AppRouter.blog.index.link,
    action: "Читать новости",
    image: "/landing/meeponegeroi.webp",
  },
  {
    label: "Telegram",
    title: "Комьюнити",
    text: "Анонсы, поиск тиммейтов и живое общение с игроками — всё в одном канале.",
    href: {
      href: "https://t.me/dota2classicru",
      passHref: true,
      matches: () => false,
    },
    action: "Открыть Telegram",
    image: "/landing/screen2.jpg",
    external: true,
  },
];

const panelBullets = [
  "Source 1 — та самая картинка и звуки",
  "Патчи эпохи TI2–TI5, без новых механик",
  "Dendi, NaVi, крики Vilat и CaspeR — это здесь живёт",
  "Атмосфера компьютерного клуба",
];

function RouteLink({
  href,
  children,
  className,
  external,
}: {
  href: { href: string | object; as?: string; passHref: boolean };
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  if (external && typeof href.href === "string") {
    return (
      <a
        className={className}
        href={href.href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href.href} as={href.as}>
      {children}
    </Link>
  );
}

export default function LandingProPage({ blog, streams }: LandingProPageProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const liveStream = streams[0] ?? null;
  const twitchChannel = liveStream?.link.split("twitch.tv/")[1] ?? null;

  return (
    <>
      <EmbedProps
        title="Dota2Classic — старая Dota, живой сервер"
        description="6.83, живой матчмейкинг, рейтинг и комьюнити. Скачай лаунчер — первый матч сегодня."
      />
      <main className={cx(c.page, threadFont.className)}>
        {/* ── HERO ── */}
        <section className={c.hero}>
          <div className={c.heroMedia}>
            <video
              className={c.heroVideo}
              muted
              loop
              playsInline
              autoPlay
              controls={false}
              src="/landing/output_action.webm"
            />
          </div>
          <div className={c.heroOverlay} />

          <div className={c.heroContent}>
            <header className={c.topbar}>
              <Link href="/" className={cx(c.brand, TrajanPro.className)}>
                Dota2Classic
              </Link>
              <nav className={c.nav}>
                <Link href={AppRouter.download.link.href} className={c.navLink}>
                  Скачать
                </Link>
                <Link href={AppRouter.queue.link.href} className={c.navLink}>
                  Игры
                </Link>
                <Link
                  href={AppRouter.meta.index.link.href}
                  className={c.navLink}
                >
                  Мета
                </Link>
                <Link
                  href={AppRouter.blog.index.link.href}
                  className={c.navLink}
                >
                  Новости
                </Link>
              </nav>
            </header>

            <div className={c.heroBody}>
              <div className={c.heroCopy}>
                <span className={c.kicker}>Dota 2 Classic</span>
                <h1 className={cx(c.heroTitle, TrajanPro.className)}>
                  Dota,{"\n"}которую ты помнишь
                </h1>
                <p className={c.heroLead}>
                  Та же карта, те же механики, реальные игроки. Скачай лаунчер и
                  зайди в матч — всё готово к первой игре уже сегодня.
                </p>
                <div className={c.heroActions}>
                  <Link
                    href={AppRouter.download.link.href}
                    className={cx(c.cta, c.ctaPrimary)}
                  >
                    Скачать лаунчер
                  </Link>
                </div>
                <dl className={c.metrics}>
                  <div className={c.metricCard}>
                    <dt>Игроков в месяц</dt>
                    <dd>1 000+</dd>
                  </div>
                  <div className={c.metricCard}>
                    <dt>Матчей 5×5 в месяц</dt>
                    <dd>500+</dd>
                  </div>
                </dl>
              </div>

              <aside className={c.heroPanel}>
                <div className={c.panelCard}>
                  <span className={c.cardTag}>Почему Dota2Classic</span>
                  <h2>Старая Dota. Живой онлайн.</h2>
                  <ul className={c.panelList}>
                    {panelBullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className={c.panelShot}>
                  {mounted && twitchChannel ? (
                    <iframe
                      className={c.panelStream}
                      src={`https://player.twitch.tv/?channel=${twitchChannel}&parent=${getDomain()}&muted=true&autoplay=true`}
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src="/landing/highres1.webp"
                      alt="Gameplay screenshot"
                    />
                  )}
                </div>
              </aside>
            </div>
          </div>
          {/* heroContent */}
        </section>

        {/* ── FEATURES ── */}
        <section className={c.section}>
          <div className={c.sectionHeader}>
            <span className={c.kicker}>Преимущества</span>
            <h2 className={c.sectionTitle}>Почему сюда возвращаются</h2>
          </div>
          <div className={c.featureGrid}>
            {features.map((f) => (
              <article className={c.featureCard} key={f.title}>
                <span className={c.cardTag}>{f.label}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── HOW TO START ── */}
        <section className={cx(c.section, c.splitSection)}>
          <div className={c.splitIntro}>
            <span className={c.kicker}>Старт</span>
            <h2 className={c.sectionTitle}>Три шага до первой игры</h2>
            <Link
              href={AppRouter.download.link.href}
              className={cx(c.cta, c.ctaPrimary, c.ctaBlock)}
            >
              Скачать лаунчер
            </Link>
          </div>
          <div className={c.stepStack}>
            {steps.map((step) => (
              <article className={c.stepCard} key={step.index}>
                <div className={c.stepTop}>
                  <span className={c.stepIndex}>{step.index}</span>
                  <h3>{step.title}</h3>
                </div>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PROOF ── */}
        <section className={cx(c.section, c.proofSection)}>
          <div className={c.sectionHeader}>
            <span className={c.kicker}>Активность</span>
            <h2 className={c.sectionTitle}>Проект живёт. Каждый день.</h2>
          </div>
          <div className={c.channelGrid}>
            {blog.data.slice(0, 3).map((post) => (
              <article className={c.channelCard} key={post.id}>
                {post.image?.url && (
                  <div className={c.channelImage}>
                    <img src={post.image.url} alt="" />
                  </div>
                )}
                <div className={c.channelBody}>
                  <span className={c.cardTag}>
                    {new Date(post.publishDate).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.shortDescription}</p>
                  <RouteLink
                    className={c.inlineAction}
                    href={AppRouter.blog.post(post.id).link}
                  >
                    Читать новость
                  </RouteLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CHANNELS ── */}
        <section className={c.section}>
          <div className={c.sectionHeader}>
            <span className={c.kicker}>Проект</span>
            <h2 className={c.sectionTitle}>Всё нужное уже под рукой</h2>
          </div>
          <div className={c.channelGrid}>
            {channels.map((ch) => (
              <article className={c.channelCard} key={ch.title}>
                <div className={c.channelImage}>
                  <img src={ch.image} alt="" />
                </div>
                <div className={c.channelBody}>
                  <span className={c.cardTag}>{ch.label}</span>
                  <h3>{ch.title}</h3>
                  <p>{ch.text}</p>
                  <RouteLink
                    className={c.inlineAction}
                    href={ch.href}
                    external={ch.external}
                  >
                    {ch.action}
                  </RouteLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className={c.finalCtaSection}>
          <div className={c.finalCtaCard}>
            <div className={c.finalCopy}>
              <span className={c.kicker}>Начни сегодня</span>
              <h2 className={cx(c.finalTitle, TrajanPro.className)}>
                Готов вернуться{"\n"}в старую Dota?
              </h2>
              <p>
                Установка занимает несколько минут. Лаунчер, клиент, очередь — и
                ты уже в первом матче.
              </p>
            </div>
            <div className={c.finalActions}>
              <Link
                href={AppRouter.download.link.href}
                className={cx(c.cta, c.ctaPrimary)}
              >
                Скачать лаунчер
              </Link>
              <Link
                href="https://t.me/dota2classicru"
                className={cx(c.cta, c.ctaSecondary)}
                target="_blank"
                rel="noreferrer"
              >
                Открыть Telegram
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

LandingProPage.layoutConfig = {
  fullBleed: true,
  noNavbar: true,
  noFooter: true,
};

LandingProPage.getInitialProps = async (): Promise<LandingProPageProps> => {
  const [blog, streams] = await Promise.all([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi()
      .statsApi.statsControllerGetTwitchStreams()
      .catch(() => []),
  ]);
  return { blog, streams };
};
