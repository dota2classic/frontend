import { AggregatedStatsDto, BlogPageDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { Button } from "@/components/Button";
import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { Surface } from "@/components/Surface";
import { TelegramInvite } from "@/components/TelegramInvite";
import { TrajanPro, threadFont } from "@/const/fonts";
import { AppRouter } from "@/route";
import cx from "clsx";
import c from "./LandingV2Page.module.scss";

interface LandingV2PageProps {
  blog: BlogPageDto;
  agg: AggregatedStatsDto;
}

const pillars = [
  {
    title: "Старая карта, старый ритм",
    text: "Никакой каши из сотни патчей. Один узнаваемый срез Dota, где пики, тайминги и матчапы снова читаются.",
  },
  {
    title: "Нормальный вход в проект",
    text: "Новый игрок должен понимать, что делать дальше: скачать, пройти короткий onboarding, зайти в первые игры и не потеряться.",
  },
  {
    title: "Живое комьюнити вокруг игры",
    text: "Новости, мета, чат, рейтинг и турниры не спрятаны по углам. Лендинг должен сразу показывать, что проект живой.",
  },
];

const steps = [
  {
    id: "01",
    title: "Скачай лаунчер",
    text: "Установка должна ощущаться как старт продукта, а не как техническая инструкция из прошлого.",
    action: "Открыть загрузку",
    link: AppRouter.download.link,
  },
  {
    id: "02",
    title: "Пройди первые матчи",
    text: "Первые игры и доступные режимы объясняются заранее, чтобы у нового игрока не было ощущения тупика.",
    action: "Посмотреть матчмейкинг",
    link: AppRouter.queue.link,
  },
  {
    id: "03",
    title: "Встройся в экосистему",
    text: "После входа у игрока сразу есть куда смотреть дальше: мета, новости, рейтинг, турниры и Discord/Telegram.",
    action: "Открыть рейтинг",
    link: AppRouter.players.leaderboard().link,
  },
];

const gallery = [
  "/landing/screen1.jpg",
  "/landing/screen2.jpg",
  "/landing/leaderboard.webp",
  "/landing/wallpaper-heroes.webp",
];

export default function LandingV2Page({ blog, agg }: LandingV2PageProps) {
  return (
    <>
      <EmbedProps
        title="Landing V2"
        description="Новый концепт лендинга для Dota 2 Classic"
      />
      <main className={cx(c.page, threadFont.className)}>
        <section className={c.hero}>
          <div className={c.heroBackdrop}>
            <video
              className={c.heroVideo}
              muted
              loop
              playsInline
              autoPlay
              controls={false}
              src="/landing/d2video-new.webm"
            />
          </div>
          <div className={c.heroShade} />
          <div className={c.heroGrid}>
            <div className={c.heroCopy}>
              <span className={c.kicker}>Dotaclassic Reframe</span>
              <h1 className={cx(c.heroTitle, TrajanPro.className)}>
                Dota, которую не надо объяснять заново
              </h1>
              <p className={c.heroLead}>
                Новый лендинг должен продавать не ностальгию в вакууме, а
                внятный продукт: понятный вход, старую игровую формулу и живой
                проект вокруг неё.
              </p>
              <div className={c.heroActions}>
                <Button
                  mega
                  className={c.primaryCta}
                  pageLink={AppRouter.download.link}
                >
                  Играть бесплатно
                </Button>
                <Button variant="ghost" pageLink={AppRouter.queue.link}>
                  Как зайти в первые игры
                </Button>
              </div>
              <div className={c.heroMetrics}>
                <div className={c.metric}>
                  <span className={c.metricValue}>{agg.humanGamesWeekly}</span>
                  <span className={c.metricLabel}>матчей за неделю</span>
                </div>
                <div className={c.metric}>
                  <span className={c.metricValue}>{agg.playersWeekly}</span>
                  <span className={c.metricLabel}>игроков за неделю</span>
                </div>
              </div>
            </div>

            <div className={c.heroRail}>
              <Surface className={c.heroCard} padding="lg" variant="raised">
                <span className={c.cardEyebrow}>What Changes</span>
                <h2 className={c.cardTitle}>Меньше шума, больше структуры</h2>
                <p className={c.cardText}>
                  Вместо текста, размазанного поверх баннеров, здесь отдельные
                  смысловые блоки: promise, onboarding, proof и финальный CTA.
                </p>
              </Surface>
              <Surface className={c.heroShot} padding="none" variant="panel">
                <img src="/landing/landing_3.webp" alt="Concept artwork" />
              </Surface>
            </div>
          </div>
        </section>

        <section className={c.section}>
          <div className={c.sectionHeading}>
            <span className={c.kicker}>Core Promise</span>
            <h2 className={c.sectionTitle}>
              На чём вообще должен держаться этот лендинг
            </h2>
          </div>
          <div className={c.pillarGrid}>
            {pillars.map((pillar) => (
              <Surface
                key={pillar.title}
                className={c.pillarCard}
                padding="lg"
                variant="surface"
                interactive
              >
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </Surface>
            ))}
          </div>
        </section>

        <section className={cx(c.section, c.onboardingSection)}>
          <div className={c.sectionHeading}>
            <span className={c.kicker}>Onboarding</span>
            <h2 className={c.sectionTitle}>
              Три действия, после которых игрок уже внутри
            </h2>
          </div>
          <div className={c.stepsGrid}>
            {steps.map((step) => (
              <Surface
                key={step.id}
                className={c.stepCard}
                padding="lg"
                variant="raised"
              >
                <span className={c.stepIndex}>{step.id}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <Button variant="primary" pageLink={step.link}>
                  {step.action}
                </Button>
              </Surface>
            ))}
          </div>
        </section>

        <section className={c.section}>
          <div className={c.sectionHeading}>
            <span className={c.kicker}>Proof</span>
            <h2 className={c.sectionTitle}>
              Лендинг должен сразу доказывать, что проект жив
            </h2>
          </div>
          <div className={c.proofGrid}>
            <Surface className={c.statsPanel} padding="lg" variant="surface">
              <div className={c.statsHeader}>
                <h3>Проект в цифрах</h3>
                <PageLink
                  className={c.inlineLink}
                  link={AppRouter.players.leaderboard().link}
                >
                  смотреть рейтинг
                </PageLink>
              </div>
              <div className={c.statRows}>
                <div className={c.statRow}>
                  <span>Игроков за неделю</span>
                  <strong>{agg.playersWeekly}</strong>
                </div>
                <div className={c.statRow}>
                  <span>Человеческих матчей</span>
                  <strong>{agg.humanGamesWeekly}</strong>
                </div>
                <div className={c.statRow}>
                  <span>Связанный next step</span>
                  <strong>скачать → сыграть → остаться</strong>
                </div>
              </div>
            </Surface>

            <div className={c.newsStack}>
              {blog.data.slice(0, 3).map((post) => (
                <Surface
                  key={post.id}
                  className={c.newsCard}
                  padding="sm"
                  variant="raised"
                  interactive
                >
                  <img src={post.image.url} alt="" />
                  <div className={c.newsContent}>
                    <span className={c.cardEyebrow}>Latest Update</span>
                    <h3>{post.title}</h3>
                    <p>{post.shortDescription}</p>
                    <PageLink
                      className={c.inlineLink}
                      link={AppRouter.blog.post(post.id).link}
                    >
                      читать новость
                    </PageLink>
                  </div>
                </Surface>
              ))}
            </div>
          </div>
        </section>

        <section className={c.section}>
          <div className={c.sectionHeading}>
            <span className={c.kicker}>Visual Direction</span>
            <h2 className={c.sectionTitle}>
              Не один баннер, а набор сцен и состояний продукта
            </h2>
          </div>
          <div className={c.galleryGrid}>
            {gallery.map((src, index) => (
              <Surface
                key={src}
                className={cx(c.galleryCard, index === 0 && c.galleryCardLarge)}
                padding="none"
                variant="panel"
              >
                <img src={src} alt="" />
              </Surface>
            ))}
            <Surface className={c.quoteCard} padding="lg" variant="surface">
              <span className={c.cardEyebrow}>Design Note</span>
              <p className={c.quote}>
                Новый landing не должен кричать “старый клиент”. Он должен
                говорить “здесь снова можно нормально играть в ту самую Dota”.
              </p>
            </Surface>
          </div>
        </section>

        <section className={c.finalSection}>
          <Surface className={c.finalCard} padding="lg" variant="raised">
            <div className={c.finalCopy}>
              <span className={c.kicker}>Final CTA</span>
              <h2 className={cx(c.finalTitle, TrajanPro.className)}>
                Если концепт подходит, следующий шаг уже не косметический
              </h2>
              <p>
                После согласования можно переносить эту структуру на `/`,
                разбирать текущий лендинг на отдельные reusable-секции и уже
                потом доводить детали копирайта и motion.
              </p>
            </div>
            <div className={c.finalActions}>
              <Button
                mega
                className={c.primaryCta}
                pageLink={AppRouter.download.link}
              >
                Открыть download
              </Button>
              <TelegramInvite className={c.telegramLink} />
            </div>
          </Surface>
        </section>
      </main>
    </>
  );
}

LandingV2Page.getInitialProps = async (): Promise<LandingV2PageProps> => {
  const [blog, agg] = await Promise.combine([
    getApi().blog.blogpostControllerBlogPage(0, 3),
    getApi().statsApi.statsControllerGetAggStats(),
  ]);

  return {
    blog,
    agg,
  };
};
