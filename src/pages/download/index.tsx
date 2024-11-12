import { EmbedProps, GenericTable, PageLink, Section } from "@/components";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { AppRouter } from "@/route";
import React, { useState } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";

import c from "./Download.module.scss";
import cx from "classnames";
import { appApi } from "@/api/hooks";

const _data = [
  [
    {
      link: "https://drive.google.com/file/d/13wnnUYpUeYP7PJQ1dSZpS8W-CTCjati6/view?usp=sharing",
      label: "Игровой клиент",
    },
    {
      link: "https://www.mediafire.com/file/37a334itg8iv6zz/Dota_2_6.84_Source_1_%25281504%2529.7z/file",
      label: "Игровой клиент",
    },
    // {
    //   link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
    //   label: "Игровой клиент",
    // },
    // {
    //   link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
    //   label: "Игровой клиент todo",
    // },
    {
      link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
      label: "Игровой клиент TODO",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
      label: "Linux библиотеки",
    },
    {
      link: "https://www.mediafire.com/file/box3btsn4ttiz1o/Dota_2_6.84_Source_1_Linux.tar.gz/file",
      label: "Linux библиотеки",
    },
    // {
    //   link: "https://mega.nz/file/YHZnjDKa#1Ra6lgjxseBYMlXAelZABazEx_ZIbvbPPJOYcM6gNO4",
    //   label: "Linux библиотеки",
    // },
    // {
    //   link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
    //   label: "Linux библиотеки todo",
    // },
    {
      link: "https://mega.nz/file/UPgSgAxS#Snc3ITt7mtm-qfW38Ye0j9eBU_Es20G8TC9N_Q8f5Sw",
      label: "Linux библиотеки TODO",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
      label: "MacOS библиотеки",
    },
    // {
    //   link: "https://www.mediafire.com/file/v1rdgopyjo5s8b1/Dota_2_6.84_Source_1_Mac.tar.gz/file",
    //   label: "MacOS библиотеки",
    // },
    // {
    //   link: "https://mega.nz/file/YHZnjDKa#1Ra6lgjxseBYMlXAelZABazEx_ZIbvbPPJOYcM6gNO4",
    //   label: "MacOS библиотеки",
    // },
    {
      link: "https://mega.nz/file/Ea5HURST#GeBiVze4vrv5VPyeM55pYJs8C_ItkmEB2z0xE7uiDHY",
      label: "MacOS библиотеки todo",
    },
    {
      link: "https://mega.nz/file/Ea5HURST#GeBiVze4vrv5VPyeM55pYJs8C_ItkmEB2z0xE7uiDHY",
      label: "MacOS библиотеки TODO",
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
      <h2>Как начать играть?</h2>
      <ol className={c.guide}>
        <li>Скачай клиент игры (windows), используя таблицу</li>
        <li>Распакуй архив с клиентом игры в удобное тебе место</li>
        {(OS === OperatingSystem.MAC_OS || OS === OperatingSystem.LINUX) && (
          <li>
            Так же тебе нужно скачать библиотеки для своей системы и извлечь их
            в папку с игрой
          </li>
        )}
        <li>
          Убедись, что у тебя запущен{" "}
          <a
            target="__blank"
            href="https://store.steampowered.com/about/"
            className="link"
          >
            Steam
          </a>
          . Без него игра работать не будет
        </li>
        <li>Зайди в папку с игрой и запусти dota.bat</li>
        <li>Запусти одиночную игру с ботами, привыкни к игре</li>
        <li>
          Понравилось? Тогда{" "}
          <a
            className="link"
            href={`${appApi.apiParams.basePath}/v1/auth/steam`}
          >
            авторизуйся
          </a>{" "}
          на сайте через Steam
        </li>
        <li>
          И сыграй свою первую{" "}
          <PageLink className="link" link={AppRouter.queue.link}>
            онлайн игру
          </PageLink>
        </li>
        <li>
          <span className="gold">ВАЖНО</span>: Steam аккаунт для игры и на сайте
          должны совпадать.
        </li>
        <li>
          <span className="gold">ВАЖНО</span>: Перед подключением к найденной
          онлайн игре необходимо открыть клиент старой доты
        </li>
      </ol>
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
              type: ColumnType.ExternalLink,
              name: "Google диск",
            },
            // {
            //   type: ColumnType.ExternalLink,
            //   name: "Media fire",
            // },
            // {
            //   type: ColumnType.ExternalLink,
            //   name: "Mega",
            // },
            {
              type: ColumnType.ExternalLink,
              name: "Яндекс Диск",
            },
            {
              type: ColumnType.ExternalLink,
              name: "Torrent",
            },
          ]}
          data={filteredData}
        />
      </Section>
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
