import {
  CoolList,
  EmbedProps,
  FAQ,
  GenericTable,
  PageLink,
  Section,
} from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import React, { useState } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";

import c from "./Download.module.scss";
import cx from "clsx";
import { appApi } from "@/api/hooks";
import { formatGameMode } from "@/util/gamemode";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { colors } from "@/colors";
import { metrika } from "@/ym";

const _data = [
  [
    {
      link: "https://drive.google.com/file/d/13wnnUYpUeYP7PJQ1dSZpS8W-CTCjati6/view?usp=sharing",
      label: "Игровой клиент",
    },
    {
      link: "https://disk.yandex.ru/d/Vl8rITrAzB04MA",
      label: "Игровой клиент",
    },
    {
      link: "/torrent/Dota 6.84.zip.torrent",
      label: "Игровой клиент",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
      label: "Linux библиотеки",
    },
    {
      link: "https://disk.yandex.ru/d/blQdLqXZwOrqjQ",
      label: "Linux библиотеки",
    },
    {
      link: "Dota 2 6.84 Source 1 Linux.tar.gz.torrent",
      label: "Linux библиотеки",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
      label: "MacOS библиотеки",
    },
    {
      link: "https://disk.yandex.ru/d/xOqxdW7BeIxKDg",
      label: "MacOS библиотеки",
    },
    {
      link: "Dota 2 6.84 Source 1 Mac.tar.gz.torrent",
      label: "MacOS библиотеки",
    },
  ],
];
interface Props {
  initialOS: OperatingSystem;
}
export default function DownloadPage({ initialOS }: Props) {
  const [OS, setOS] = useState(initialOS);

  let filteredData = [..._data];
  switch (OS) {
    case OperatingSystem.LINUX:
      filteredData = [_data[0], _data[1]];
      break;
    case OperatingSystem.WINDOWS:
      filteredData = [_data[0]];
      break;
    case OperatingSystem.MAC_OS:
      filteredData = [_data[0], _data[2]];
  }
  return (
    <>
      <EmbedProps
        title={"Начать играть"}
        description={
          "Подробная инструкция для скачивания, установки и поиска игры Dota 2. Скачать старую версию dota 2 здесь"
        }
      />
      <h2 style={{ textAlign: "center" }}>Как начать играть?</h2>
      <CoolList
        items={[
          {
            title: "Скачать игровой клиент",
            content: (
              <>
                Для игры в старую доту нужен старый клиент игры. Мы скачали и
                собрали его по кусочкам, чтобы тебе осталось только скачать
                архив с готовой игрой из таблицы ниже.
                {(OS === OperatingSystem.MAC_OS ||
                  OS === OperatingSystem.LINUX) && (
                  <>
                    <br />
                    <span className="gold">
                      Так же тебе нужно скачать библиотеки для своей системы и
                      извлечь их в папку с игрой
                    </span>
                  </>
                )}
                <Section>
                  <div className={cx(c.options)}>
                    {[
                      OperatingSystem.WINDOWS,
                      OperatingSystem.MAC_OS,
                      OperatingSystem.LINUX,
                    ].map((os) => (
                      <div
                        className={cx(c.option, os === OS && c.active)}
                        key={os}
                        onClick={() => setOS(os)}
                      >
                        {os}
                      </div>
                    ))}
                  </div>
                  <GenericTable
                    isLoading={false}
                    keyProvider={(it) => it[0].link}
                    placeholderRows={9}
                    columns={[
                      {
                        type: ColumnType.Raw,
                        name: "Google диск",
                        format: (r) => (
                          <a
                            style={{ color: colors.green }}
                            target="__blank"
                            href={r.link}
                            onClick={() =>
                              metrika("reachGoal", "DOWNLOAD_GOOGLE")
                            }
                          >
                            {r.label}
                          </a>
                        ),
                      },
                      {
                        type: ColumnType.Raw,
                        name: "Яндекс Диск",
                        format: (r) => (
                          <a
                            style={{ color: colors.green }}
                            target="__blank"
                            href={r.link}
                            onClick={() =>
                              metrika("reachGoal", "DOWNLOAD_YANDEX")
                            }
                          >
                            {r.label}
                          </a>
                        ),
                      },
                      {
                        type: ColumnType.Raw,
                        name: "Torrent",
                        format: (r) => (
                          <a
                            style={{ color: colors.green }}
                            target="__blank"
                            href={r.link}
                            onClick={() =>
                              metrika("reachGoal", "DOWNLOAD_TORRENT")
                            }
                          >
                            {r.label}
                          </a>
                        ),
                      },
                    ]}
                    data={filteredData}
                  />
                </Section>
              </>
            ),
          },
          {
            title: "Запустить игру",
            content: (
              <>
                Запускать игру из архива не нужно: для этого сначала нужно
                распаковать архив. Распакуй в удобную тебе папку и запусти
                dota.bat. Если при запуске игры возникли неполадки, попробуй
                установить DirectX и MicrosoftVisualC++. Это необходимые
                библиотеки для запуска игры, которые должен скачивать Steam
                <ul>
                  <li>
                    <a
                      className="link"
                      href="https://www.microsoft.com/ru-ru/download/details.aspx?id=35"
                      target="__blank"
                    >
                      DirectX
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="https://aka.ms/vs/16/release/vc_redist.x86.exe"
                      target="__blank"
                    >
                      скачать Microsoft Visual C++ для 32 бит
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="https://aka.ms/vs/16/release/vc_redist.x64.exe"
                      target="__blank"
                    >
                      скачать Microsoft Visual C++ для 64 бит
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="http://forum.ru-board.com/topic.cgi?forum=5&amp;topic=10616&amp;start=820"
                      target="__blank"
                    >
                      скачать NET Framework
                    </a>
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "Первый матч с ботами",
            content: (
              <>
                Старая дота очень сильно отличается от современной версии: даже
                если ты опытный игрок, тебе будет очень непривычно. Мы
                рекомендуем сначала поиграть с ботами, чтобы настроить бинды,
                привыкнуть к старым героям, карте и способностям.
              </>
            ),
          },
          {
            title: "Авторизоваться на сайте",
            content: (
              <>
                Для игры с людьми был создан этот сайт: ты не можешь просто
                нажать поиск в самом клиенте, это начнет поиск в актуальной
                версии игры.
                <br />
                Поэтому у нас свой матчмейкинг, для которого нужно{" "}
                <a
                  className="link"
                  href={`${appApi.apiParams.basePath}/v1/auth/steam`}
                >
                  авторизоваться через Steam.
                </a>{" "}
                Это безопасно и нужно для поиска онлайн игры.
                <br />
                <span className="gold">ВАЖНО</span>: Steam аккаунт для игры и на
                сайте должны совпадать.
              </>
            ),
          },
          {
            title: "Первая онлайн игра",
            content: (
              <>
                Ты близок к онлайн игре как никогда! Но для игры через сайт
                нужно В поиске через сайт нет ничего сложного, но перед игрой с
                другими игроками тебе нужно сыграть обучение. Это обычный матч с
                ботами, но на наших серверах. Тебе предстоит:
                <ol>
                  <li>
                    <PageLink link={AppRouter.queue.link} className="link">
                      Поставить поиск
                    </PageLink>{" "}
                    на нашем сайте в {formatGameMode(MatchmakingMode.BOTS)}
                  </li>
                  <li>Принять найденную игру</li>
                  <li>Открыть игровой клиент</li>
                  <li>Загрузиться на сервер по инструкции из найденной игры</li>
                  <li>Завершить игру с ботами</li>
                </ol>
              </>
            ),
          },
          {
            title: "Пришло время для настоящих игр!",
            content: (
              <>
                Поздравляю, ты завершил свой первый онлайн матч!
                <br />
                Мы ждем тебя в{" "}
                <PageLink link={AppRouter.queue.link} className="link">
                  поиске
                </PageLink>{" "}
                в режиме {formatGameMode(MatchmakingMode.UNRANKED)}. Играем мы
                обычно вечером, примерно с 18:00 по МСК.
                <br />А пока можешь изучить{" "}
                <PageLink
                  className="link"
                  link={AppRouter.matches.index().link}
                >
                  историю матчей
                </PageLink>
                ,{" "}
                <PageLink className="link" link={AppRouter.heroes.index.link}>
                  сильнейших героев
                </PageLink>{" "}
                или{" "}
                <PageLink
                  className="link"
                  link={AppRouter.players.leaderboard().link}
                >
                  таблицу лидеров.
                </PageLink>
              </>
            ),
          },
        ]}
      />
      {/*<h2 style={{ textAlign: "center" }}>Ссылки на скачивание игры</h2>*/}

      <h2 style={{ textAlign: "center", marginTop: 40 }}>
        FAQ - часто задаваемые вопросы
      </h2>
      <FAQ
        items={[
          {
            title: "Какая версия игры используется?",
            content: (
              <>
                Мы играем на версии 6.84c. Это последняя версия игры на{" "}
                <span className="gold">Source 1</span>, а так же самый
                популярный патч по количеству игроков.
              </>
            ),
          },
          {
            title: "Это безопасно?",
            content: (
              <>
                Если ты не будешь искать и использовать читы на эту версию - да.
                По сути наш проект это как общественные сервера по CS 1.6. Мы
                запускаем официальный сервер от Valve, только старой версии
              </>
            ),
          },
          {
            title: "Могу ли я играть с баном в доте?",
            content: (
              <>
                Баны в актуальной версии игры не работают на нашем сайте.
                Однако, если будешь часто покидать игры, руинить игры и в целом
                плохо себя вести - будешь забанен и здесь.
              </>
            ),
          },
          {
            title: "Не запускается игра, что делать?",
            content: (
              <>
                Скорее всего тебе чего-то не хватает. Возможные решения:
                <ul>
                  <li>
                    Ты не распаковал архив с игрой и пытаешься запустить игру из
                    архива. Распакуй архив и запусти игру.
                  </li>
                  <li>
                    Установить{" "}
                    <a
                      className="link"
                      href="https://www.microsoft.com/ru-ru/download/details.aspx?id=35"
                      target="__blank"
                    >
                      DirectX
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="https://aka.ms/vs/16/release/vc_redist.x86.exe"
                      target="__blank"
                    >
                      Установить Microsoft Visual C++ для 32 бит
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="https://aka.ms/vs/16/release/vc_redist.x64.exe"
                      target="__blank"
                    >
                      Установить Microsoft Visual C++ для 64 бит
                    </a>
                  </li>
                  <li>
                    <a
                      className="link"
                      href="http://forum.ru-board.com/topic.cgi?forum=5&amp;topic=10616&amp;start=820"
                      target="__blank"
                    >
                      Установить NET Framework
                    </a>
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "Steam client is missing or out of date",
            content: (
              <>
                Один из нижеперечисленных вариантов поможет вам исправить эту
                проблему:
                <ul>
                  <li>Войти в аккаунт Steam</li>
                  <li>Перезапустить Steam</li>
                  <li>Перезагрузить пк</li>
                  <li>Выключить режим невидимки в Steam</li>
                  <li>
                    Запустить DOTA Classic и Steam от имени администратора
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: "Failed to load the launcher DLL",
            content: (
              <>
                Для ее исправления необходимо исключить русские/кириллические
                буквы в пути или же распаковать архив на рабочий стол. Если это
                вам не помогает, то распакуйте архив с игрой в корень диска C:\
                или D:\
              </>
            ),
          },
        ]}
      />
    </>
  );
}

DownloadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  if (ctx.req) {
    // ssr
    const ua = ctx.req.headers["user-agent"];
    return { initialOS: getOSFromHeader(ua || "") };
  } else {
    // browser
    return {
      initialOS: getOS(),
    };
  }
};
