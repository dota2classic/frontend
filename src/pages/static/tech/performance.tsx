import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import c from "@/pages/static/Static.module.scss";
import React from "react";
import { TechStaticTabs } from "@/containers/TechStaticTabs";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { CoolList } from "@/components/CoolList";
import { CopyBlock } from "@/components/CopyBlock";
import { CopySomething } from "@/components/CopySomething";
import { Input } from "@/components/Input";
import { Table } from "@/components/Table";

export default function PerformanceTechTab() {
  const { t } = useTranslation();

  return (
    <div className={cx(NotoSans.className, c.container)}>
      <EmbedProps
        title={t("performance_tab.performanceImprovementTitle")}
        description={t("performance_tab.performanceImprovementDescription")}
      />
      <TechStaticTabs />
      <h1>{t("performance_tab.performanceSettings")}</h1>

      <h2>{t("performance_tab.removeLagTitle")}</h2>
      <p>{t("performance_tab.fixClientBug")}</p>
      <div className={c.block}>
        <CoolList
          items={[
            {
              title: t("performance_tab.findHostsFileTitle"),
              content: (
                <>
                  <CopyBlock
                    command={"C:\\Windows\\System32\\drivers\\etc"}
                    text={t("performance_tab.hostsFileFolder")}
                  />
                </>
              ),
            },
            {
              title: t("performance_tab.editTitle"),
              content: (
                <>
                  <ol>
                    <li>{t("performance_tab.rightClickFile")}</li>
                    <li>{t("performance_tab.clickProperties")}</li>
                    <li>{t("performance_tab.securityTab")}</li>
                    <li>{t("performance_tab.clickChange")}</li>
                    <li>{t("performance_tab.allowCheckboxes")}</li>
                  </ol>
                  <img src="/guide/hosts.webp" alt="" />
                  <ol>
                    <li>{t("performance_tab.openHostsFile")}</li>
                    <li>
                      {t("performance_tab.addLineToEnd")}
                      <CopySomething
                        something={"0.0.0.0 www.dota2.com"}
                        placeholder={
                          <Input
                            value={"0.0.0.0 www.dota2.com"}
                            readOnly={true}
                          />
                        }
                      />
                    </li>
                  </ol>
                  <p>{t("performance_tab.finalResultSubtitle")}</p>
                  <img src="/guide/hosts2.webp" alt="" />
                </>
              ),
            },
            {
              title: t("performance_tab.checkTitle"),
              content: (
                <>
                  <p>{t("performance_tab.checkClientLagFree")}</p>
                  <ol>
                    <li>{t("performance_tab.enterGameClient")}</li>
                    <li>{t("performance_tab.todayTab")}</li>
                    <li>
                      {t("performance_tab.emptyPageError")}
                      <span className="red">-105 / -107 / -108</span> -{" "}
                      {t("performance_tab.performanceImproved")}
                    </li>
                  </ol>
                </>
              ),
            },
            {
              title: t("performance_tab.restoreTitle"),
              content: (
                <>
                  <p>{t("performance_tab.restoreInstructions")}</p>
                  <ol>
                    <li>{t("performance_tab.openHostsFile")}</li>
                    <li>{t("performance_tab.removeLine")}</li>
                    <li>{t("performance_tab.saveFile")}</li>
                    <li>{t("performance_tab.siteAvailableAgain")}</li>
                  </ol>
                </>
              ),
            },
          ]}
        />
      </div>

      <h2>{t("performance_tab.netgraphTitle")}</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              command={"net_graph 1"}
              text={t("performance_tab.showFpsPingLoss")}
            />
          </li>
          <li>
            <CopyBlock
              command={"net_graphpos 1"}
              text={t("performance_tab.showRight")}
            />
          </li>
          <li>
            <CopyBlock
              command={"net_graphpos 2"}
              text={t("performance_tab.showCenter")}
            />
          </li>
          <li>
            <CopyBlock
              command={"net_graphpos 3"}
              text={t("performance_tab.showLeft")}
            />
          </li>
          <li>
            <CopyBlock
              command={"net_graphproportionalfont 1"}
              text={t("performance_tab.increaseFont")}
            />
          </li>
        </ul>
      </div>

      <h2>{t("performance_tab.performanceCommandsTitle")}</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              text={t("performance_tab.altTabFrequency")}
              command={"engine_no_focus_sleep 20"}
            />
          </li>
          <li>
            <CopyBlock
              text={t("performance_tab.asyncSoundMixing")}
              command="snd_mix_async 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("performance_tab.multithread")}
              command="cl_threaded_init 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("performance_tab.alternateShadowRender")}
              command="r_shadow_deferred_simd 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("performance_tab.alternateBones")}
              command="cl_simdbones 1; cl_use_simd_bones 1"
            />
          </li>
        </ul>
      </div>

      <h2>{t("performance_tab.improvingResponsivenessTitle")}</h2>
      <div className={c.block}>
        <p>{t("performance_tab.ifPingBelow")}</p>
        <CopyBlock text={t("performance_tab.command1")} command="сl_interp 0" />
        <CopyBlock
          text={t("performance_tab.command2")}
          command="cl_interp_ratio 1"
        />
        <p>
          {t("performance_tab.monitorLerpParameter")}{" "}
          <span className="gold">lerp</span>{" "}
          {t("performance_tab.netgraphMonitor")}
        </p>
        <Table className="compact">
          <thead>
            <tr>
              <th>{t("performance_tab.lerpReading")}</th>
              <th>{t("performance_tab.consoleCommand")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("performance_tab.red")}</td>
              <td>
                <CopyBlock
                  text="cl_interp (0 - 0.05)"
                  command="cl_interp 0.033"
                />
              </td>
            </tr>
            <tr>
              <td>{t("performance_tab.yellow")}</td>
              <td>
                <CopyBlock text="" command="cl_interp 0.037" />
              </td>
            </tr>
            <tr>
              <td>{t("performance_tab.orange")}</td>
              <td>
                <CopyBlock text="" command="cl_interp 0.039" />
              </td>
            </tr>
            <tr>
              <td>{t("performance_tab.notWhite")}</td>
              <td>
                <CopyBlock text="" command="cl_interp_ratio 2" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
