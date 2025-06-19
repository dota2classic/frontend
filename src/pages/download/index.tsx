import {
  BigTabs,
  CoolList,
  EmbedProps,
  FAQ,
  GenericTable,
  PageLink,
  Section,
  TelegramInvite,
} from "@/components";
import React, { useState } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";
import { formatGameMode } from "@/util/gamemode";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { metrika } from "@/ym";
import { getAuthUrl } from "@/util/getAuthUrl";
import { ColumnType } from "@/const/tables";
import c from "./Download.module.scss";
import { NotoSans } from "@/const/notosans";

const _data = [
  [
    {
      link: "https://drive.google.com/file/d/1RKJ3kbTuSzspfZ9N1-RLWrtXw6nXt6FN/view?usp=sharing",
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
      link: "/torrent/Dota 2 6.84 Source 1 Linux.tar.gz.torrent",
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
      link: "/torrent/Dota 2 6.84 Source 1 Mac.tar.gz.torrent",
      label: "MacOS библиотеки",
    },
  ],
];
interface Props {
  initialOS: OperatingSystem;
}

const GuideCompact = () => [
  {
    title: "Запустить игру",
    content: (
      <>
        Распакуй скаченный архив с игрой, запусти Steam, а затем запусти{" "}
        <span className="gold">dota.exe</span>
        <p>
          Пока скачивается игра, заходи к нам в <TelegramInvite />! Там много
          интересного, а еще тебе помогут, если возникнут трудности.
        </p>
      </>
    ),
  },
  {
    title: "Авторизоваться на сайте",
    content: (
      <>
        <p>
          Для игры с людьми был создан этот сайт: ты не можешь просто нажать
          поиск в самом клиенте, это начнет поиск в актуальной версии игры.
        </p>
        <p>
          Поэтому у нас свой матчмейкинг, для которого нужно{" "}
          <a className="link" href={getAuthUrl()}>
            авторизоваться через Steam.
          </a>{" "}
          Это безопасно и нужно для поиска онлайн игры.
        </p>
        <p>
          <span className="gold">ВАЖНО</span>: Steam аккаунт для игры и на сайте
          должны совпадать.
        </p>
      </>
    ),
  },
  {
    title: "Обучение: игра против ботов",
    content: (
      <>
        <p>
          Тебе нужно пройти обучение на сайте: это обычная игра против ботов.
          Так ты привыкнешь к старой доте, познакомишься с оригинальными героями
          и их способностями, настроишь игру и бинды под свои предпочтения.
        </p>
        Тебе предстоит:
        <ol>
          <li>
            <PageLink link={AppRouter.queue.link} className="link">
              Поставить поиск
            </PageLink>{" "}
            на нашем сайте в{" "}
            <span className="gold">{formatGameMode(MatchmakingMode.BOTS)}</span>
          </li>
          <li>Принять найденную игру</li>
          <li>
            Запустить <span className="shit">Steam</span>, запустить клиент игры
          </li>
          <li>
            Загрузиться по кнопке "подключиться" или вставив команду в консоль
          </li>
          <li>Победить ботов</li>
        </ol>
      </>
    ),
  },
  {
    title: "Пришло время для настоящих игр!",
    content: (
      <>
        <p>
          Поздравляю, ты завершил свой первый онлайн матч! Мы ждем тебя в{" "}
          <PageLink link={AppRouter.queue.link} className="link">
            поиске
          </PageLink>{" "}
          в режиме {formatGameMode(MatchmakingMode.UNRANKED)}. Играем мы обычно
          вечером, примерно с 18:00 по МСК.
        </p>
        А пока можешь изучить{" "}
        <PageLink className="link" link={AppRouter.matches.index().link}>
          историю матчей
        </PageLink>
        ,{" "}
        <PageLink className="link" link={AppRouter.heroes.index.link}>
          сильнейших героев
        </PageLink>{" "}
        или{" "}
        <PageLink className="link" link={AppRouter.players.leaderboard().link}>
          таблицу лидеров.
        </PageLink>
      </>
    ),
  },
];

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

  const coolListContent = [
    {
      title: "Скачать игровой клиент",
      content: (
        <>
          <p>
            Для игры в старую доту нужен старый клиент игры. Это не кастомка:
            это реальная дота из 2015 года.
          </p>
          <p>
            <span className="gold">ВАЖНО:</span> не нажимай поиск матча в самой
            игре
          </p>
          {(OS === OperatingSystem.MAC_OS || OS === OperatingSystem.LINUX) && (
            <>
              <p className="gold">
                Также тебе нужно скачать библиотеки для своей системы и извлечь
                их в папку с игрой
              </p>
            </>
          )}
          <Section>
            <BigTabs<OperatingSystem>
              items={[
                OperatingSystem.WINDOWS,
                OperatingSystem.MAC_OS,
                OperatingSystem.LINUX,
              ].map((os) => ({
                key: os,
                label: os,
                onSelect: setOS,
              }))}
              selected={OS}
              flavor={"small"}
            />

            <GenericTable
              className={"medium"}
              isLoading={false}
              keyProvider={(it) => it[0].link}
              placeholderRows={9}
              columns={[
                {
                  type: ColumnType.Raw,
                  name: "Google диск",
                  format: (r) => (
                    <a
                      target="__blank"
                      href={r.link}
                      className="link"
                      onClick={() => metrika("reachGoal", "DOWNLOAD_GOOGLE")}
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
                      target="__blank"
                      href={r.link}
                      className="link"
                      onClick={() => metrika("reachGoal", "DOWNLOAD_YANDEX")}
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
                      className="link"
                      target="__blank"
                      href={r.link}
                      onClick={() => metrika("reachGoal", "DOWNLOAD_TORRENT")}
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
    ...GuideCompact(),
  ];
  return (
    <div className={NotoSans.className}>
      <EmbedProps
        title={"Начать играть"}
        description={
          "Подробная инструкция для скачивания, установки и поиска игры Dota 2. Скачать старую версию dota 2 здесь"
        }
      />
      <h1 style={{ textAlign: "center" }}>Как начать играть?</h1>
      <CoolList items={coolListContent} />
      <h2 style={{ textAlign: "center", marginTop: 40 }}>
        Полезные консольные команды
      </h2>
      <ul className={c.guide}>
        <li>
          ФПС, пинг, потери пакетов - <span className="shit">net_graph 1</span>
        </li>
        <li>
          Отключить приближение камеры -{" "}
          <span className="shit">dota_camera_disable_zoom 1</span>
        </li>
        <li>
          Добивание союзных крипов на ПКМ -{" "}
          <span className="shit">dota_force_right_click_attack 1</span>
        </li>
        <li>
          Автоматический повтор нажатия ПКМ -{" "}
          <span className="shit">dota_player_auto_repeat_right_mouse 1</span>
        </li>
        <li>
          Отключить задержку клика по мини-карте -{" "}
          <span className="shit">dota_minimap_misclick_time 0</span>
        </li>
        <li>
          Увеличение иконок героев на мини-карте -{" "}
          <span className="shit">dota_minimap_hero_size 1000</span>
        </li>
        <li>
          Быстрая атака -{" "}
          <span className="shit">
            bind "a" "mc_attack; +sixense_left_click; -sixense_left_click"
          </span>
        </li>
        <li>
          Идти в направлении -{" "}
          <span className="shit">
            dota_unit_allow_moveto_direction 1, bind alt
            +dota_unit_movetodirection
          </span>
        </li>
        <li>
          Дальность умений -{" "}
          <span className="shit">dota_disable_range_finder 0</span>
        </li>
      </ul>

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
            title: "Only one dota 2 client per customer",
            content: (
              <>
                Закройте клиент новой или старой доты, если уже открыт (убейте
                процесс через диспетчер задач). Одновременно может быть запущен
                только 1 клиент доты.
              </>
            ),
          },
          {
            title: "Ошибка не найден dota.exe",
            content: (
              <>
                Нужно в .bat файл через блокнот в начале прописать cd{" "}
                <span className="gold">C:\Program Files (x86)\Dota 6.84</span>{" "}
                (заменить на путь до клиента со старой дотой)
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
                    архива. Распакуй архив с помощью 7-zip и запусти игру.
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
            title:
              "Failed to load the launcher DLL / Setup file 'gameinfo.txt' doesn't exist in subdirectory 'dota2'",
            content: (
              <>
                Возможно, архив с игрой не до конца распаковался. Настойчиво
                рекомендуем использовать <span className="gold">7-zip</span> для
                разархивации.
                <br />
                Для ее исправления необходимо исключить русские/кириллические
                буквы в пути или же распаковать архив на рабочий стол. Если это
                вам не помогает, то распакуйте архив с игрой в корень диска C:\
                или D:\
              </>
            ),
          },
          {
            title: "Графические артефакты",
            content: (
              <>
                Можно попробовать:
                <ol>
                  <li>
                    <span className="shit"> gl_clear 0</span> в консоль
                  </li>
                  <li>
                    Переустановить видеодрайвера, либо установить более позднюю
                    / новую версию
                  </li>
                </ol>
              </>
            ),
          },
        ]}
      />
    </div>
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
