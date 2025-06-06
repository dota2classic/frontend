import React from "react";
import { RulePunishmentDto } from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import c from "./EditPunishmentsContainer.module.scss";
import cx from "clsx";
import { Button, Duration, Input } from "@/components";
import { useAsyncButton } from "@/util/use-async-button";
import { getApi } from "@/api/hooks";
import { runInAction } from "mobx";
import { NotoSans } from "@/const/notosans";

interface IEditPunishmentsContainerProps {
  punishments?: RulePunishmentDto[];
}

export const EditPunishmentsContainer: React.FC<IEditPunishmentsContainerProps> =
  observer(({ punishments }) => {
    const state = useLocalObservable<{
      punishments: RulePunishmentDto[];
      editedPunishment?: RulePunishmentDto;
    }>(() => ({
      punishments: punishments || [],
      editedPunishment: undefined,
    }));

    const revalidateAll = (edited?: RulePunishmentDto) =>
      getApi()
        .rules.ruleControllerGetAllPunishments()
        .then((punishments) =>
          runInAction(() => {
            state.punishments = punishments;
            state.editedPunishment = edited;
          }),
        );

    const [creating, createPunishment] = useAsyncButton(async () => {
      const p = await getApi().rules.ruleControllerCreatePunishment();
      await revalidateAll(p);
    }, [state]);

    const [updating, updatePunishment] = useAsyncButton(async () => {
      if (!state.editedPunishment) return;
      const updated = await getApi().rules.ruleControllerUpdatePunishment(
        state.editedPunishment.id,
        {
          durationHours: state.editedPunishment.durationHours,
          title: state.editedPunishment.title,
        },
      );

      await revalidateAll(updated);
    }, [state]);

    const [deleting, deletePunishment] = useAsyncButton(async () => {
      if (!state.editedPunishment) return;
      await getApi().rules.ruleControllerDeletePunishment(
        state.editedPunishment.id,
      );

      await revalidateAll(undefined);
    }, [state]);

    return (
      <div className={cx(c.container, NotoSans.className)}>
        <div className={c.list}>
          <Button disabled={creating} onClick={createPunishment}>
            Новое наказание
          </Button>
          {state.punishments.map((p) => (
            <div
              onClick={() => {
                runInAction(() => {
                  state.editedPunishment = p;
                });
              }}
              key={p.id}
              className={cx(
                c.list_item,
                p.id === state.editedPunishment?.id && c.list_item__selected,
              )}
            >
              <span>{p.title}</span>
              <span>
                <Duration duration={p.durationHours * 60 * 60} long />
              </span>
            </div>
          ))}
        </div>
        <div className={c.edit}>
          {state.editedPunishment && (
            <>
              <header>Название</header>
              <Input
                placeholder={"Наказание"}
                value={state.editedPunishment.title}
                onChange={(e) =>
                  runInAction(() => {
                    state.editedPunishment!.title = e.target.value;
                  })
                }
              />

              <header>Часов блокировки</header>
              <Input
                type="number"
                placeholder={"12"}
                value={state.editedPunishment.durationHours}
                onChange={(e) =>
                  runInAction(() => {
                    state.editedPunishment!.durationHours = Number(
                      e.target.value,
                    );
                  })
                }
              />

              <div className={c.buttons}>
                <Button disabled={updating} onClick={updatePunishment}>
                  Сохранить
                </Button>
                <Button disabled={deleting} onClick={deletePunishment}>
                  Удалить
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  });
