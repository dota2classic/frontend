import {
  BigTabs,
  CoolList,
  EmbedProps,
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
import { NotoSans } from "@/const/notosans";
import { TechStaticTabs } from "@/containers";
import { DiscordInvite } from "@/components/TelegramInvite/DiscordInvite";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const _data = [
  [
    {
      link: "https://drive.google.com/file/d/1RKJ3kbTuSzspfZ9N1-RLWrtXw6nXt6FN/view?usp=sharing",
      label: "download_page.gameClient",
    },
    {
      link: "https://disk.yandex.ru/d/e6dil7uN8qTYSQ",
      label: "download_page.gameClient",
    },
    {
      link: "https://host.dotaclassic.ru/Dota6.84.zip",
      label: "download_page.gameClient",
    },
    {
      link: "/torrent/Dota 6.84.zip.torrent",
      label: "download_page.gameClient",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
      label: "download_page.linuxBinaries",
    },
    {
      link: "https://disk.yandex.ru/d/6IFRyqlGS3rqag",
      label: "download_page.linuxBinaries",
    },
    {
      link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
      label: "download_page.linuxBinaries",
    },
    {
      link: "/torrent/Dota 2 6.84 Source 1 Linux.tar.gz.torrent",
      label: "download_page.linuxBinaries",
    },
  ],

  [
    {
      link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
      label: "download_page.macosBinaries",
    },
    {
      link: "https://disk.yandex.ru/d/-52JcDeQONUs0A",
      label: "download_page.macosBinaries",
    },
    {
      link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
      label: "download_page.macosBinaries",
    },
    {
      link: "/torrent/Dota 2 6.84 Source 1 Mac.tar.gz.torrent",
      label: "download_page.macosBinaries",
    },
  ],
];
interface Props {
  initialOS: OperatingSystem;
}

const GuideCompact = (t: TFunction) => [
  {
    title: "download_page.launchGame",
    content: (
      <>
        {t("download_page.extractGame")}, {t("download_page.startSteam")},{" "}
        {t("download_page.runDotaExe")} <span className="gold">dota.exe</span>
        <p>
          {t("download_page.downloadingGame")}, {t("download_page.joinUs")}{" "}
          <TelegramInvite /> и <DiscordInvite />!{" "}
          {t("download_page.helpWithToughness")}
        </p>
      </>
    ),
  },
  {
    title: "download_page.authorizeTitle",
    content: (
      <>
        <p>
          {t("download_page.forPlayingWithPeople")}:{" "}
          {t("download_page.cantJustSearch")}
        </p>
        <p>
          {t("download_page.ownMatchmaking")},{" "}
          {t("download_page.authThroughSteam")}
          <a className="link" href={getAuthUrl()}>
            {t("download_page.authorize")}
          </a>
          .
        </p>
        <p>
          <span className="gold">{t("download_page.important")}</span>:{" "}
          {t("download_page.steamAccountMustMatch")}
        </p>
      </>
    ),
  },
  {
    title: "download_page.educationTutorial",
    content: (
      <>
        <p>{t("download_page.passTraining")}</p>
        {t("download_page.trainingProcess")}
        <ol>
          <li>
            <span className="gold">{t("download_page.important")}</span>:{" "}
            {t("download_page.serversInRussia")}
          </li>
          <li>
            <PageLink link={AppRouter.queue.link} className="link">
              {t("download_page.setupSearch")}
            </PageLink>{" "}
            {t("download_page.inMode")}
            <span className="gold">{formatGameMode(MatchmakingMode.BOTS)}</span>
          </li>
          <li>{t("download_page.acceptGame")}</li>
          <li>
            {t("download_page.startSteam")},{" "}
            {t("download_page.startGameClient")}
          </li>
          <li>{t("download_page.connectButton")}</li>
          <li>{t("download_page.defeatBots")}</li>
        </ol>
      </>
    ),
  },
  {
    title: "download_page.humanGames",
    content: (
      <>
        <p>
          {t("download_page.congratulations")},{" "}
          {t("download_page.firstOnlineMatch")},{" "}
          {t("download_page.lookingForIn")}
          <PageLink link={AppRouter.queue.link} className="link">
            {t("download_page.search")}
          </PageLink>{" "}
          {t("download_page.mode")}
          {formatGameMode(MatchmakingMode.UNRANKED)}.
        </p>
        {t("download_page.learnAbout")}
        <PageLink className="link" link={AppRouter.matches.index().link}>
          {t("download_page.matchHistory")}
        </PageLink>
        , {t("download_page.strongestHeroes")},
        <PageLink className="link" link={AppRouter.heroes.index.link}>
          {t("download_page.strongestHeroes")}
        </PageLink>{" "}
        {t("download_page.leaderboardTable")}
      </>
    ),
  },
];

export default function DownloadPage({ initialOS }: Props) {
  const { t } = useTranslation();
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
      title: t("download_page.downloadGameClient"),
      content: (
        <>
          <p>{t("download_page.forOldDota")}</p>
          <p>
            <span className="gold">{t("download_page.important")}</span>:{" "}
            {t("download_page.dontClickMatchSearch")}
          </p>
          {(OS === OperatingSystem.MAC_OS || OS === OperatingSystem.LINUX) && (
            <>
              <p className="gold">{t("download_page.downloadLibraries")}</p>
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
                  name: t("download_page.googleDrive"),
                  format: (r) => (
                    <a
                      target="__blank"
                      href={r.link}
                      className="link"
                      onClick={() => metrika("reachGoal", "DOWNLOAD_GOOGLE")}
                    >
                      {t(r.label)}
                    </a>
                  ),
                },
                {
                  type: ColumnType.Raw,
                  name: t("download_page.yandexDisk"),
                  format: (r) => (
                    <a
                      target="__blank"
                      href={r.link}
                      className="link"
                      onClick={() => metrika("reachGoal", "DOWNLOAD_YANDEX")}
                    >
                      {t(r.label)}
                    </a>
                  ),
                },
                {
                  type: ColumnType.Raw,
                  name: t("download_page.ourWebsite"),
                  format: (r) => (
                    <a
                      target="__blank"
                      href={r.link}
                      className="link"
                      onClick={() => metrika("reachGoal", "DOWNLOAD_D2C")}
                    >
                      {t(r.label)}
                    </a>
                  ),
                },
                {
                  type: ColumnType.Raw,
                  name: t("download_page.torrent"),
                  format: (r) => (
                    <a
                      className="link"
                      target="__blank"
                      href={r.link}
                      onClick={() => metrika("reachGoal", "DOWNLOAD_TORRENT")}
                    >
                      {t(r.label)}
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
    ...GuideCompact(t),
  ];
  return (
    <div className={NotoSans.className}>
      <EmbedProps
        title={t("download_page.startPlaying")}
        description={t("download_page.detailedInstructions")}
      />
      <TechStaticTabs />
      <h1 style={{ textAlign: "center" }}>
        {t("download_page.howToStartPlaying")}
      </h1>
      <CoolList items={coolListContent} />
    </div>
  );
}

DownloadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  if (ctx.req) {
    const ua = ctx.req.headers["user-agent"];
    return { initialOS: getOSFromHeader(ua || "") };
  } else {
    return {
      initialOS: getOS(),
    };
  }
};
