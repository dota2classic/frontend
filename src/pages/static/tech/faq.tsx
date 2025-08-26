import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import c from "@/pages/static/Static.module.scss";
import React from "react";
import { TechStaticTabs } from "@/containers";
import { CopyBlock, EmbedProps, FAQ, PageLink } from "@/components";
import { AppRouter } from "@/route";
import { DiscordInvite } from "@/components/TelegramInvite/DiscordInvite";
import { useTranslation } from "react-i18next";

export default function FaqTechTab() {
  const { t } = useTranslation();

  return (
    <div className={cx(NotoSans.className, c.container)}>
      <EmbedProps title={t("faq.title")} description={t("faq.description")} />
      <TechStaticTabs />
      <h2 style={{ textAlign: "center", marginTop: 40 }}>{t("faq.header")}</h2>
      <FAQ
        items={[
          {
            title: t("faq.items.version.title"),
            content: (
              <>
                {t("faq.items.version.content.part1")}
                <span className="gold">
                  {t("faq.items.version.content.source1")}
                </span>
                {t("faq.items.version.content.part2")}
              </>
            ),
          },
          {
            title: t("faq.items.safe.title"),
            content: (
              <>
                {t("faq.items.safe.content.part1")}
                {t("faq.items.safe.content.part2")}
              </>
            ),
          },
          {
            title: t("faq.items.ban.title"),
            content: <>{t("faq.items.ban.content.part1")}</>,
          },
          {
            title: t("faq.items.console.title"),
            content: <>{t("faq.items.console.content")}</>,
          },
          {
            title: t("faq.items.settings.title"),
            content: (
              <>
                <p>
                  {t("faq.items.settings.content.part1")}
                  <span className="shit">
                    {t("faq.items.settings.content.part2")}
                  </span>
                  {t("faq.items.settings.content.part3")}
                </p>
                <CopyBlock
                  text={t("faq.items.settings.content.copyBlock1.text")}
                  command={t("faq.items.settings.content.copyBlock1.command")}
                />
                <CopyBlock
                  text={t("faq.items.settings.content.copyBlock2.text")}
                  command={t("faq.items.settings.content.copyBlock2.command")}
                />
              </>
            ),
          },
          {
            title: t("faq.items.connection.title"),
            content: (
              <>
                <ul>
                  <li>{t("faq.items.connection.content.checkAccounts")}</li>
                  <li>{t("faq.items.connection.content.relogin")}</li>
                  <li>{t("faq.items.connection.content.tryAgain")}</li>
                  <li>{t("faq.items.connection.content.ukraineNote")}</li>
                  <li>{t("faq.items.connection.content.internetNote")}</li>
                  <li>{t("faq.items.connection.content.redownload")}</li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.items.newDota.title"),
            content: <>{t("faq.items.newDota.content.part1")}</>,
          },
          {
            title: t("faq.items.clientLimit.title"),
            content: <>{t("faq.items.clientLimit.content.part1")}</>,
          },
          {
            title: t("faq.items.dotaExeError.title"),
            content: (
              <>
                {t("faq.items.dotaExeError.content.part1")}
                <span className="gold">
                  {t("faq.items.dotaExeError.content.path")}
                </span>
              </>
            ),
          },
          {
            title: t("faq.items.launchError.title"),
            content: (
              <>
                {t("faq.items.launchError.content.part1")}
                <ul>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part1")}
                  </li>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part2")}
                  </li>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part3")}
                  </li>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part4")}
                  </li>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part5")}
                  </li>
                  <li>
                    {t("faq.items.launchError.content.possibleSolutions.part6")}
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.items.steamClient.title"),
            content: (
              <>
                {t("faq.items.steamClient.content.part1")}
                <ul>
                  <li>{t("faq.items.steamClient.content.solution1")}</li>
                  <li>{t("faq.items.steamClient.content.solution2")}</li>
                  <li>{t("faq.items.steamClient.content.solution3")}</li>
                  <li>{t("faq.items.steamClient.content.solution4")}</li>
                  <li>{t("faq.items.steamClient.content.solution5")}</li>
                </ul>
              </>
            ),
          },
          {
            title: t("faq.items.launcherError.title"),
            content: (
              <>
                {t("faq.items.launcherError.content.part1")}
                {t("faq.items.launcherError.content.part2")}
              </>
            ),
          },
          {
            title: t("faq.items.graphicsAudio.title"),
            content: (
              <>
                {t("faq.items.graphicsAudio.content.part1")}
                <ol>
                  <li>
                    <CopyBlock
                      text={t(
                        "faq.items.graphicsAudio.content.copyBlock1.text",
                      )}
                      command={t(
                        "faq.items.graphicsAudio.content.copyBlock1.command",
                      )}
                    />
                  </li>
                  <li>{t("faq.items.graphicsAudio.content.driverInstall")}</li>
                  <li>{t("faq.items.graphicsAudio.content.audioRestart")}</li>
                  <li>{t("faq.items.graphicsAudio.content.disableExtras")}</li>
                  <li>
                    {t("faq.items.graphicsAudio.content.switchToDiscrete")}
                  </li>
                  <li>
                    {t("faq.items.graphicsAudio.content.ifNotHelped")}
                    <ol>
                      <li>
                        <CopyBlock
                          text={t(
                            "faq.items.graphicsAudio.content.copyBlock2.text",
                          )}
                          command={t(
                            "faq.items.graphicsAudio.content.copyBlock2.command",
                          )}
                        />
                      </li>
                      <li>
                        <CopyBlock
                          text={t(
                            "faq.items.graphicsAudio.content.copyBlock3.text",
                          )}
                          command={t(
                            "faq.items.graphicsAudio.content.copyBlock3.command",
                          )}
                        />
                      </li>
                      <li>
                        <CopyBlock
                          text={t(
                            "faq.items.graphicsAudio.content.copyBlock4.text",
                          )}
                          command={t(
                            "faq.items.graphicsAudio.content.copyBlock4.command",
                          )}
                        />
                      </li>
                      <li>
                        {t("faq.items.graphicsAudio.content.startupParams")}
                      </li>
                    </ol>
                  </li>
                </ol>
              </>
            ),
          },
          {
            title: t("faq.items.keybindAbility.title"),
            content: <>{t("faq.items.keybindAbility.content")}</>,
          },
          {
            title: t("faq.items.mouseBind.title"),
            content: <>{t("faq.items.mouseBind.content")}</>,
          },
          {
            title: t("faq.items.smartAttack.title"),
            content: <>{t("faq.items.smartAttack.content")}</>,
          },
          {
            title: t("faq.items.lobby15.title"),
            content: (
              <>
                {t("faq.items.lobby15.content.part1")}
                <PageLink className="link" link={AppRouter.store.index.link}>
                  {t("faq.items.lobby15.content.part2")}
                </PageLink>{" "}
                {t("faq.items.lobby15.content.part3")}
              </>
            ),
          },
          {
            title: t("faq.items.meta.title"),
            content: (
              <>
                {t("faq.items.meta.content.part1")}
                <PageLink className="link" link={AppRouter.meta.index.link}>
                  {t("faq.items.meta.content.part2")}
                </PageLink>{" "}
                {t("faq.items.meta.content.part3")}
                <DiscordInvite /> {t("faq.items.meta.content.part4")}
              </>
            ),
          },
          {
            title: t("faq.items.replay.title"),
            content: (
              <>
                {t("faq.items.replay.content.part1")}
                <PageLink link={AppRouter.matches.download(33630).link}>
                  {t("faq.items.replay.content.part2")}
                </PageLink>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
