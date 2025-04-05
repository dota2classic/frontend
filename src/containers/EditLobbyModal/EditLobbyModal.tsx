import React, { useCallback, useState } from "react";

import c from "./EditLobbyModal.module.scss";
import { LobbyDto, UpdateLobbyDto } from "@/api/back";
import {
  Button,
  Checkbox,
  GenericModal,
  Input,
  SelectOptions,
} from "@/components";
import { DotaGameModeOptions, DotaMapOptions } from "@/const/options";
import { getApi } from "@/api/hooks";
import { useFocusLock } from "@/util/useTypingCallback";
import cx from "clsx";

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
    <GenericModal title={"Настройки лобби"} onClose={onClose}>
      <div className={c.settings}>
        <div className={c.formItem}>
          <header>Название</header>
          <Input
            placeholder={"Название лобби"}
            value={lobbySettings.name || ""}
            onChange={(e) =>
              setLobbySettings((r) => ({ ...r, name: e.target.value }))
            }
          />
        </div>

        <div className={c.formItem}>
          <header>Пароль</header>
          <Input
            placeholder={"Без пароля"}
            value={lobbySettings.password || ""}
            onChange={(e) =>
              setLobbySettings((r) => ({ ...r, password: e.target.value }))
            }
          />
        </div>
        <div className={c.formItem}>
          <header>Карта</header>
          <SelectOptions
            options={DotaMapOptions}
            selected={lobbySettings.map || lobby.map}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, map: value.value }));
              }
            }}
            defaultText={"Карта"}
          />
        </div>
        <div className={c.formItem}>
          <header>Режим игры</header>
          <SelectOptions
            options={DotaGameModeOptions}
            selected={lobbySettings.gameMode || lobby.gameMode}
            onSelect={(value, meta) => {
              if (meta.action === "select-option") {
                setLobbySettings((r) => ({ ...r, gameMode: value.value }));
              }
            }}
            defaultText={"Режим игры"}
          />
        </div>
        <div className={cx(c.formItem, c.formItem__inline)}>
          <span>Включить читы</span>
          <Checkbox
            checked={lobbySettings.enableCheats}
            onChange={(e) =>
              setLobbySettings((r) => ({ ...r, enableCheats: e }))
            }
          />
        </div>
        <div className={cx(c.formItem, c.formItem__inline)}>
          <span>Добавить ботов</span>
          <Checkbox
            checked={lobbySettings.fillBots}
            onChange={(e) => setLobbySettings((r) => ({ ...r, fillBots: e }))}
          />
        </div>
        <Button className={c.startGame} onClick={updateLobby}>
          Сохранить изменения
        </Button>
      </div>
    </GenericModal>
  );
};
