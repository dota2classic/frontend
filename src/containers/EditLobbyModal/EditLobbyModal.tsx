import React, { useCallback, useState } from "react";

import c from "./EditLobbyModal.module.scss";
import { LobbyDto, UpdateLobbyDto } from "@/api/back";
import {
  DotaPatchOptions,
  RegionOptions,
  useDotaGameModeOptions,
  useDotaMapOptions,
} from "@/const/options";
import { getApi } from "@/api/hooks";
import { useFocusLock } from "@/util/useTypingCallback";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { GenericModal } from "@/components/GenericModal";
import { Input } from "@/components/Input";
import { SelectOptions } from "@/components/SelectOptions";
import { Checkbox } from "@/components/Checkbox";
import { Button } from "@/components/Button";
import { NotoSans } from "@/const/notosans";
import { Field } from "@/components/Field";

interface IEditLobbyModalProps {
  onClose: () => void;
  lobby: LobbyDto;
  onUpdatedLobby: (lobby: LobbyDto) => Promise<void>;
}

export const EditLobbyModal: React.FC<IEditLobbyModalProps> = ({
  onClose,
  lobby,
  onUpdatedLobby,
}) => {
  const { t } = useTranslation();

  const dotaGameModeOptions = useDotaGameModeOptions();
  const dotaMapOptions = useDotaMapOptions();

  const [lobbySettings, setLobbySettings] = useState<Partial<UpdateLobbyDto>>({
    ...lobby,
  });

  useFocusLock();

  const updateLobby = useCallback(async () => {
    const l = await getApi().lobby.lobbyControllerUpdateLobby(
      lobby.id,
      lobbySettings,
    );
    await onUpdatedLobby(l);
    onClose();
  }, [lobby.id, lobbySettings, onClose, onUpdatedLobby]);

  return (
    <GenericModal
      className={c.modal}
      title={t("edit_lobby.settings")}
      onClose={onClose}
    >
      <div className={cx(c.settings, NotoSans.className)}>
        <Field label={t("edit_lobby.name")}>
          <Input
            placeholder={t("edit_lobby.lobbyName")}
            value={lobbySettings.name || ""}
            onChange={(e) =>
              setLobbySettings((r) => ({ ...r, name: e.target.value }))
            }
          />
        </Field>

        <Field label={t("edit_lobby.password")}>
          <Input
            placeholder={t("edit_lobby.noPassword")}
            value={lobbySettings.password || ""}
            onChange={(e) =>
              setLobbySettings((r) => ({ ...r, password: e.target.value }))
            }
          />
        </Field>
        <Field label={t("edit_lobby.map")}>
          <SelectOptions
            options={dotaMapOptions}
            selected={lobbySettings.map || lobby.map}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, map: value.value }));
              }
            }}
            defaultText={t("edit_lobby.selectMap")}
          />
        </Field>
        <Field label={t("edit_lobby.gameMode")}>
          <SelectOptions
            options={dotaGameModeOptions}
            selected={lobbySettings.gameMode || lobby.gameMode}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, gameMode: value.value }));
              }
            }}
            defaultText={t("edit_lobby.selectGameMode")}
          />
        </Field>
        <Field label={t("edit_lobby.patch")}>
          <SelectOptions
            options={DotaPatchOptions}
            selected={lobbySettings.patch || lobby.patch}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, patch: value.value }));
              }
            }}
            defaultText={t("edit_lobby.gamePatch")}
          />
        </Field>
        <Field label={t("edit_lobby.server")}>
          <SelectOptions
            options={RegionOptions}
            selected={lobbySettings.region || lobby.region}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, region: value.value }));
              }
            }}
            defaultText={t("edit_lobby.serverRegion")}
          />
        </Field>
        <Field className={c.checkboxes} label={t("edit_lobby.settingsHeader")}>
          <div className={c.box}>
            <Checkbox
              checked={lobbySettings.enableCheats}
              disabled
              onChange={(e) =>
                setLobbySettings((r) => ({ ...r, enableCheats: e }))
              }
            >
              {t("edit_lobby.enableCheats")}
            </Checkbox>
            <p>{t("edit_lobby.featureTemporarilyDisabled")}</p>
          </div>
          <div className={c.box}>
            <Checkbox
              checked={lobbySettings.fillBots}
              onChange={(e) => setLobbySettings((r) => ({ ...r, fillBots: e }))}
            >
              {t("edit_lobby.addBots")}
            </Checkbox>
            <p>{t("edit_lobby.emptySlotsFilledWithBots")}</p>
          </div>
          <div className={c.box}>
            <Checkbox
              checked={lobbySettings.enableBanStage}
              onChange={(e) =>
                setLobbySettings((r) => ({ ...r, enableBanStage: e }))
              }
            >
              {t("edit_lobby.enableBanStage")}
            </Checkbox>
            <p>{t("edit_lobby.banStageDescription")}</p>
          </div>
          <div className={c.box}>
            <Checkbox
              checked={lobbySettings.noRunes}
              onChange={(e) => setLobbySettings((r) => ({ ...r, noRunes: e }))}
            >
              {t("edit_lobby.disableRunes")}
            </Checkbox>
          </div>
          <div className={c.box}>
            <Checkbox
              checked={lobbySettings.midTowerToWin}
              onChange={(e) =>
                setLobbySettings((r) => ({ ...r, midTowerToWin: e }))
              }
            >
              {t("edit_lobby.enableMidMode")}
            </Checkbox>
            <p>{t("edit_lobby.midModeDescription")}</p>
          </div>
          <div className={c.box}>
            <Field label={t("edit_lobby.killsToWin")} layout="horizontal">
              <Input
                type="number"
                min={1}
                max={100}
                step={1}
                value={lobbySettings.midTowerKillsToWin}
                onChange={(e) =>
                  setLobbySettings((r) => ({
                    ...r,
                    midTowerKillsToWin: Number(e.target.value),
                  }))
                }
              />
            </Field>
          </div>
        </Field>

        <Button className={c.startGame} onClick={updateLobby}>
          {t("edit_lobby.saveChanges")}
        </Button>
      </div>
    </GenericModal>
  );
};
