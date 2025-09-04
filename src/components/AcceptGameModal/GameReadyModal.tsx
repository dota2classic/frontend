import cx from "clsx";
import c from "./AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import { useLocalStorageBackedParam } from "@/util/useLocalStorageBackedParam";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { CopySomething } from "../CopySomething";
import { Input } from "../Input";

export const GameReadyModal = observer(
  ({ className }: { className?: string }) => {
    const { t } = useTranslation();
    const q = useStore().queue;

    const [fullGuide, setFullGuide] = useLocalStorageBackedParam<boolean>(
      "d2c:show_connect_guide",
      true,
    );

    const toggleInfo = useCallback(() => {
      setFullGuide(!fullGuide);
    }, [fullGuide]);

    if (!q.gameState) return null;

    return (
      <div className={className} data-testid="game-ready-modal">
        <h2>{t("game_ready_modal.title")}</h2>
        <div className={c.connectInfo}>
          <a
            className={cx(c.button2, c.accept)}
            target={"__blank"}
            href={`steam://connect/${q.gameState?.serverUrl}`}
          >
            {t("game_ready_modal.connectToGame")}
          </a>
          <Button
            mega
            small
            onClick={async () => {
              const doAbandon = confirm(t("game_ready_modal.confirmExit"));
              if (doAbandon) {
                await q.abandon();
              }
            }}
          >
            <IoClose />
          </Button>
        </div>
        <CopySomething
          something={`connect ${q.gameState?.serverUrl}`}
          placeholder={
            <Input
              value={`connect ${q.gameState?.serverUrl}`}
              readOnly={true}
            />
          }
        />
        <div className={c.fullInstruction}>
          <div className={cx(c.guide, fullGuide && c.guide__visible)}>
            {t("game_ready_modal.instructions")}
            <ol>
              <li>{t("game_ready_modal.step1")}</li>
              <li>{t("game_ready_modal.step2")}</li>
              <li>{t("game_ready_modal.step3")}</li>
              <li>{t("game_ready_modal.step4")}</li>
            </ol>
          </div>
          <Button onClick={toggleInfo} className={c.toggleInfo}>
            {fullGuide ? (
              <>
                {" "}
                {t("game_ready_modal.hideGuide")} <FaEyeSlash />{" "}
              </>
            ) : (
              <>
                {" "}
                {t("game_ready_modal.showGuide")} <FaEye />{" "}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  },
);
