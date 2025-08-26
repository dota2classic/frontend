import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import c from "@/pages/static/Static.module.scss";
import React from "react";
import { TechStaticTabs } from "@/containers";
import { CopyBlock, EmbedProps } from "@/components";
import { useTranslation } from "react-i18next";

export default function CommandsTechTab() {
  const { t } = useTranslation();

  return (
    <div className={cx(NotoSans.className, c.container)}>
      <EmbedProps
        title={t("commands_tech_tab.clientSetupTitle")}
        description={t("commands_tech_tab.oldClientDescription")}
      />
      <TechStaticTabs />
      <h1>{t("commands_tech_tab.clientSetup")}</h1>

      <h2>{t("commands_tech_tab.usefulConsoleCommands")}</h2>
      <div className={c.block}>
        <ul>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.setUpperFPS")}
              command="fps_max 360"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.notReturnCameraOnSpawn")}
              command="dota_reset_camera_on_spawn 0"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.disableScreenShake")}
              command="dota_screen_shake 0"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.cameraSpeed")}
              command="dota_camera_speed 3000"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.cameraAcceleration")}
              command="dota_camera_accelerate 49"
            />
          </li>

          <li>
            <CopyBlock
              text={t("commands_tech_tab.disableCameraZoom")}
              command="dota_camera_disable_zoom 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.forceRightClickAttack")}
              command="dota_force_right_click_attack 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.autoRepeatRightClick")}
              command="dota_player_auto_repeat_right_mouse 1"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.disableMinimapClickDelay")}
              command="dota_minimap_misclick_time 0"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.increaseHeroIconsOnMinimap")}
              command="dota_minimap_hero_size 1000"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.quickAttack")}
              command={`bind "a" "mc_attack; +sixense_left_click; -sixense_left_click"`}
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.moveDirection")}
              command={`dota_unit_allow_moveto_direction 1, bind alt +dota_unit_movetodirection`}
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.abilityRange")}
              command={`dota_disable_range_finder 0`}
            />
          </li>
        </ul>
      </div>

      <h2>{t("commands_tech_tab.cameraDistance")}</h2>
      <div className={c.block}>
        <ol>
          <li>
            {t("commands_tech_tab.findFile")}
            <span className="gold">Dota 6.84/dota/bin/client.dll</span>
          </li>
          <li>{t("commands_tech_tab.copyFileWarning")}</li>
          <li>{t("commands_tech_tab.openFile")}</li>
          <li>
            {t("commands_tech_tab.searchStandardCameraHeight")}
            <span className="gold">1134</span>
            {t("commands_tech_tab.importanceValueInSearch")}
            <span className="gold">ВАЖНО!</span>
            {t("commands_tech_tab.needsValueNearSearch")}
            <span className="shit">dota_camera_pitch_max</span>
          </li>
          <li>
            {t("commands_tech_tab.changeToRequiredDistance")}
            {t("commands_tech_tab.recommendHeight")}
          </li>
          <li>{t("commands_tech_tab.saveFileRestartClient")}</li>
          <li>
            {t("commands_tech_tab.readyFileDescription")}
            <a href="https://disk.yandex.ru/d/re1lVyKCeoXx-Q" className="link">
              client.dll
            </a>
            {t("commands_tech_tab.replaceInGameFolder")}
          </li>
        </ol>
      </div>

      <h2>{t("commands_tech_tab.quickCastsAndSelfCasting")}</h2>
      <div className={c.block}>
        <ol>
          <li>
            {t("commands_tech_tab.checkSelfCasting")}
            <img src="/guide/quick3.webp" alt="" />
          </li>
          <li>
            {t("commands_tech_tab.setKeyALT")}
            <img src="/guide/quick1.webp" alt="" />
            <img src="/guide/quick2.webp" alt="" />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.consoleCommandSelfCastTimeout")}
              command="dota_ability_self_cast_timeout 0.2"
            />
          </li>
        </ol>
      </div>

      <h2>{t("commands_tech_tab.highlightUnits")}</h2>
      <div className={c.block}>
        <p>
          {t("commands_tech_tab.colorSelectionAdvice")}
          <a href="https://rgbcolorpicker.com/0-1">rgbcolorpicker.com</a>
        </p>
        <h3>{t("commands_tech_tab.forOwnTeam")}</h3>
        <ol>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.redColor")}
              command="dota_friendly_color_r 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.greenColor")}
              command="dota_friendly_color_g 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.blueColor")}
              command="dota_friendly_color_b 0.5"
            />
          </li>
        </ol>
        <h3>{t("commands_tech_tab.forEnemyTeam")}</h3>
        <ol>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.redColor")}
              command="dota_enemy_color_r 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.greenColor")}
              command="dota_enemy_color_g 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.blueColor")}
              command="dota_enemy_color_b 0.5"
            />
          </li>
        </ol>
        <h3>{t("commands_tech_tab.neutrals")}</h3>
        <ol>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.redColor")}
              command="dota_neutral_color_r 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.greenColor")}
              command="dota_neutral_color_g 0.5"
            />
          </li>
          <li>
            <CopyBlock
              text={t("commands_tech_tab.blueColor")}
              command="dota_neutral_color_b 0.5"
            />
          </li>
        </ol>
      </div>
    </div>
  );
}
