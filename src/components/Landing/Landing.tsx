import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import c from "./Landing.module.scss";
import { CoolList, Duration, EmbedProps, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import Image from "next/image";

export const Landing = () => {
  useEffect(() => {
    if (typeof window !== "undefined")
      AOS.init({
        disable: "mobile",
      });
  }, []);
  return (
    <>
      <EmbedProps
        title={"Играть в старую доту онлайн"}
        description={
          "Dota2Classic это единственный способ поиграть в старую доту из 2015 года. Здесь ты сможешь вспомнить ту самую игру."
        }
      >
        <link rel="canonical" href="https://dotaclassic.ru" />
      </EmbedProps>
      <div className={c.block}>
        <div className={c.promoVideoWrapper}>
          <video
            muted
            loop
            autoPlay
            controls={false}
            src={`/landing/d2video-new.webm`}
          />
        </div>
        <div
          className={c.leadingIntent}
          data-aos="fade-right"
          data-aos-delay="500"
          data-aos-duration="1500"
        >
          <h1>Волшебный мир старой Доты</h1>
          <PageLink link={AppRouter.download.link} className={c.playButton}>
            Играть бесплатно
          </PageLink>
        </div>
      </div>
      <div className={cx(c.block)}>
        <div className={c.promoVideoWrapper}>
          <Image
            className={c.backimage}
            src="/landing/landing_1.jpg"
            width={1280}
            height={720}
            alt=""
          />
        </div>
        <div
          className={c.wow}
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-duration="1500"
        >
          <h2>Присоединяйся</h2>
          <div>К тысячам игроков, которые предпочитают настоящую доту</div>
        </div>
      </div>
      <div className={c.block}>
        <div className={c.intent}>
          <CoolList
            items={[
              {
                title: "Скачать игровой клиент",
                content: (
                  <>
                    Для игры в старую доту нужен старый клиент игры. Мы скачали
                    и собрали его по кусочкам, чтобы тебе осталось только
                    скачать архив с готовой игрой.{" "}
                    <PageLink link={AppRouter.download.link} className="link">
                      Скачать архив с игрой
                    </PageLink>
                  </>
                ),
              },
              {
                title: "Первый запуск игры",
                content: (
                  <>
                    Запускать игру из архива не нужно: для этого сначала нужно
                    распаковать архив. Распакуй в удобную тебе папку и запусти
                    dota.bat.
                  </>
                ),
              },
              {
                title: "Первый матч с ботами",
                content: (
                  <>
                    Старая дота очень сильно отличается от современной версии:
                    даже если ты опытный игрок, тебе будет очень непривычно. Мы
                    рекомендуем сначала поиграть с ботами, чтобы настроить
                    бинды, привыкнуть к старым героям, карте и способностям.
                  </>
                ),
              },
              {
                title: "Первая онлайн игра",
                content: (
                  <>
                    Для игры с людьми был создан этот сайт: ты не можешь просто
                    нажать поиск в самом клиенте. В поиске через сайт нет ничего
                    сложного, но перед игрой с другими игроками тебе нужно
                    сыграть обучение. Это обычный матч с ботами, но на наших
                    серверах. Тебе предстоит принять игру, подключить к игровому
                    серверу и завершить матч.
                  </>
                ),
              },
            ]}
          />

          <h3>Кто мы такие</h3>
          <div className={c.longtext}>
            <ol>
              <li>dota2classic - проект энтузиастов и фанатов старой Dota 2</li>
              <li>
                Проект существует <b className="gold">4 года</b>, за это время
                более <b className="gold">14 тысяч игроков</b> сыграло более{" "}
                <b className="gold">20 тысяч матчей</b> продолжительностью{" "}
                <span className="gold">
                  <Duration big duration={35130960} />
                </span>
              </li>
              <li>
                Весь исходный код можно найти на{" "}
                <a
                  target="__blank"
                  href="https://github.com/dota2classic"
                  className="link"
                >
                  Github
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div
        className={cx(c.block, c.carousel)}
        // data-aos="fade-up"
        // data-aos-delay="0"
        // data-aos-duration="1500"
      >
        <PageLink link={AppRouter.players.leaderboard().link}>
          <h3>Лучшие игроки</h3>
          <Image
            width={380}
            height={245}
            style={{ scale: 1.1 }}
            src="/landing/leaderboard.jpg"
            alt="Leaderboard"
          />
        </PageLink>
        <PageLink link={AppRouter.matches.index().link}>
          <h3>Матчи</h3>
          <Image
            width={380}
            height={245}
            src="/landing/fight.jpg"
            alt="Match history"
          />
        </PageLink>
        <PageLink link={AppRouter.heroes.index.link}>
          <h3>Сильнейшие герои</h3>
          <Image
            width={380}
            height={245}
            src="/landing/invoker.jpg"
            alt="Strongest heroes"
          />
        </PageLink>
      </div>

      <div className={c.block} style={{ paddingBottom: 100 }}>
        <PageLink link={AppRouter.download.link} className={c.playButton}>
          Играть бесплатно
        </PageLink>
      </div>
    </>
  );
};
