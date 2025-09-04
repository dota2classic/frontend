import React, { useState } from "react";
import { getOS, getOSFromHeader, OperatingSystem } from "@/util/detect-os";
import { NextPageContext } from "next";
import { MatchmakingMode } from "@/api/mapped-models";
import { AppRouter } from "@/route";
import { metrika } from "@/ym";
import { getAuthUrl } from "@/util/getAuthUrl";
import { ColumnType } from "@/const/tables";
import { NotoSans } from "@/const/notosans";
import { TechStaticTabs } from "@/containers/TechStaticTabs";
import { DiscordInvite, TelegramInvite } from "@/components/TelegramInvite";
import { Trans, TranslationFunction, useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PageLink } from "@/components/PageLink";
import { Section } from "@/components/Section";
import { BigTabs } from "@/components/BigTabs";
import { GenericTable } from "@/components/GenericTable";
import { EmbedProps } from "@/components/EmbedProps";
import { CoolList } from "@/components/CoolList";

const useDownloadData = () => {
  const { t } = useTranslation();

  return [
    [
      {
        link: "https://drive.google.com/file/d/1RKJ3kbTuSzspfZ9N1-RLWrtXw6nXt6FN/view?usp=sharing",
        label: t("download_page.gameClient"),
      },
      {
        link: "https://disk.yandex.ru/d/e6dil7uN8qTYSQ",
        label: t("download_page.gameClient"),
      },
      {
        link: "https://host.dotaclassic.ru/Dota6.84.zip",
        label: t("download_page.gameClient"),
      },
      {
        link: "/torrent/Dota 6.84.zip.torrent",
        label: t("download_page.gameClient"),
      },
    ],

    [
      {
        link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
        label: t("download_page.linuxBinaries"),
      },
      {
        link: "https://disk.yandex.ru/d/6IFRyqlGS3rqag",
        label: t("download_page.linuxBinaries"),
      },
      {
        link: "https://drive.google.com/file/d/1DE0t-R_UDnLnalNz3SmS4fE0-OlhHNB-/view?usp=sharing",
        label: t("download_page.linuxBinaries"),
      },
      {
        link: "/torrent/Dota 2 6.84 Source 1 Linux.tar.gz.torrent",
        label: t("download_page.linuxBinaries"),
      },
    ],

    [
      {
        link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
        label: t("download_page.macosBinaries"),
      },
      {
        link: "https://disk.yandex.ru/d/-52JcDeQONUs0A",
        label: t("download_page.macosBinaries"),
      },
      {
        link: "https://drive.google.com/file/d/1p3v4woa0Tzr_xSGk0zlW7AdH2VmK4YhF/view?usp=share_link",
        label: t("download_page.macosBinaries"),
      },
      {
        link: "/torrent/Dota 2 6.84 Source 1 Mac.tar.gz.torrent",
        label: t("download_page.macosBinaries"),
      },
    ],
  ];
};

interface Props {
  initialOS: OperatingSystem;
}

const GuideCompact = (t: TranslationFunction) => [
  {
    title: t("download_page.launchGame"),
    content: (
      <>
        <Trans
          i18nKey="download_page.extractGame"
          components={{ dota: <span className="red" /> }}
        />
        <p>
          <Trans
            i18nKey="download_page.downloadingGame"
            components={{
              telegram: <TelegramInvite />,
              discord: <DiscordInvite />,
            }}
          />
        </p>
      </>
    ),
  },
  {
    title: t("download_page.authorizeTitle"),
    content: (
      <>
        <p>{t("download_page.forPlayingWithPeople")}</p>
        <p>
          <Trans
            i18nKey="download_page.cantJustSearch"
            components={{
              steamauth: <a className="link" href={getAuthUrl()} />,
            }}
          />
        </p>
        <p>
          <Trans
            i18nKey="download_page.steamAccountMustMatch"
            components={{
              attention: <span className="gold" />,
            }}
          />
        </p>
      </>
    ),
  },
  {
    title: t("download_page.educationTutorial"),
    content: (
      <>
        <p>{t("download_page.passTraining")}</p>
        <p>{t("download_page.trainingProcess")}</p>
        <ol>
          <li>
            <Trans
              i18nKey="download_page.serversInRussia"
              components={{ attention: <span className="gold" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="download_page.setupSearch"
              values={{
                mode: t(
                  `matchmaking_mode.${MatchmakingMode.BOTS}` as TranslationKey,
                ),
              }}
              components={{
                queue: (
                  <PageLink link={AppRouter.queue.link} className="link" />
                ),
                mode: <span className="gold" />,
              }}
            />
          </li>
          <li>{t("download_page.acceptGame")}</li>
          <li>{t("download_page.startGameClient")}</li>
          <li>{t("download_page.connectButton")}</li>
          <li>{t("download_page.defeatBots")}</li>
        </ol>
      </>
    ),
  },
  {
    title: t("download_page.humanGames"),
    content: (
      <>
        <p>
          <Trans
            i18nKey="download_page.congratulations"
            components={{
              mode: <span className="gold" />,
              queue: <PageLink link={AppRouter.queue.link} className="link" />,
            }}
            values={{
              mode: t(
                `matchmaking_mode.${MatchmakingMode.UNRANKED}` as TranslationKey,
              ),
            }}
          />
        </p>
        <Trans
          i18nKey="download_page.learnAbout"
          components={{
            history: (
              <PageLink
                className="link"
                link={AppRouter.matches.index().link}
              />
            ),
            leaderboard: (
              <PageLink
                className="link"
                link={AppRouter.players.leaderboard().link}
              />
            ),
            heroes: (
              <PageLink className="link" link={AppRouter.heroes.index.link} />
            ),
          }}
        />
      </>
    ),
  },
];

export default function DownloadPage({ initialOS }: Props) {
  const { t } = useTranslation();
  const [OS, setOS] = useState(initialOS);
  const _data = useDownloadData();

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
            <Trans
              i18nKey="download_page.dontClickMatchSearch"
              components={{
                attention: <span className="gold" />,
              }}
            />
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
              flavor={"big"}
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
        title={t("download_page.seo.title")}
        description={t("download_page.seo.description")}
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
