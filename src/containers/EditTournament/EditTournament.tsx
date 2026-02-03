import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import c from "./EditTournament.module.scss";
import {
  BracketType,
  CreateTournamentDto,
  DotaGameMode,
  TournamentDto,
} from "@/api/back";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Input } from "@/components/Input";
import { runInAction } from "mobx";
import { ImagePickerUploader } from "@/components/ImagePickerUploader";
import DatePicker from "react-datepicker";
import cx from "clsx";
import { SelectOptions } from "@/components/SelectOptions";
import { Button } from "@/components/Button";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { useDotaGameModeOptions } from "@/const/options";

interface IEditTournamentProps {
  tournament?: TournamentDto;
}

const strategies = [
  {
    value: BracketType.SINGLEELIMINATION,
    label: "Single elimination",
  },
  {
    value: BracketType.DOUBLEELIMINATION,
    label: "Double elimination",
  },
];

export const EditTournament: React.FC<IEditTournamentProps> = observer(
  ({ tournament }) => {
    const data = useLocalObservable<CreateTournamentDto>(() => ({
      name: tournament?.name || "",
      description: tournament?.description || "",
      teamSize: tournament?.teamSize || 0,
      imageUrl: tournament?.imageUrl || "",
      startDate:
        tournament?.startDate ||
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),

      prize: tournament?.prize || "",

      strategy: tournament?.strategy || BracketType.SINGLEELIMINATION,
      roundBestOf: tournament?.bestOfConfig?.round || 1,
      finalBestOf: tournament?.bestOfConfig?._final || 1,
      grandFinalBestOf: tournament?.bestOfConfig?.grandFinal || 1,
      gameMode: tournament?.gameMode || DotaGameMode.CAPTAINS_MODE,
      gameBreakDurationSeconds:
        tournament?.scheduleStrategy?.gameBreakDurationSeconds || 60 * 10,
      gameDurationSeconds:
        tournament?.scheduleStrategy?.gameDurationSeconds || 60 * 50,
    }));

    const update = (partial: Partial<typeof data>) => {
      runInAction(() => {
        Object.assign(data, partial);
      });
    };

    const [isSaving, saveTournament] = useAsyncButton(async () => {
      try {
        let redirectToTid: number;
        if (tournament) {
          redirectToTid = tournament.id;
          await getApi().tournament.tournamentControllerUpdateTournament(
            tournament.id,
            data,
          );
        } else {
          const tour =
            await getApi().tournament.tournamentControllerCreateTournament(
              data,
            );
          redirectToTid = tour.id;
        }

        AppRouter.admin.tournament.tournament(redirectToTid).open();
      } catch (e) {
        await handleException("Ошибка при обновлении турнира", e);
      }
    }, [data, tournament]);

    const dotaGameModeOptions = useDotaGameModeOptions();

    return (
      <div className={c.form}>
        {/*Name*/}
        <div className={c.form__row}>
          <header>Название турнира</header>
          <Input
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </div>
        {/*Description*/}
        <div className={c.form__row}>
          <header>Описание</header>
          <Input
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </div>
        {/*TeamSize*/}
        <div className={c.form__row}>
          <header>Игроков в команде</header>
          <Input
            type="number"
            max={5}
            min={1}
            value={data.teamSize}
            onChange={(e) => update({ teamSize: Number(e.target.value) })}
          />
        </div>
        {/*Prize*/}
        <div className={c.form__row}>
          <header>Информация о призе</header>
          <Input
            placeholder={"5 копеек"}
            value={data.prize}
            onChange={(e) => update({ prize: e.target.value })}
          />
        </div>
        {/*Image*/}
        <div className={c.form__row}>
          <header>Лого турнира</header>
          <ImagePickerUploader
            onSelectImage={(img) =>
              update({
                imageUrl: img.url,
              })
            }
          />
          <img className={c.image} width={300} src={data.imageUrl} alt="" />
        </div>
        {/*GameMode*/}
        <div className={c.form__row}>
          <header>Игровой режим</header>
          <SelectOptions
            defaultText={"Игровой режим"}
            options={dotaGameModeOptions}
            selected={data.gameMode}
            onSelect={(e) => update({ gameMode: e.value })}
          />
        </div>
        {/*Game duration*/}
        <div className={c.form__row}>
          <header>Ожидаемая длительность игры(минут)</header>
          <Input
            type="number"
            max={120}
            min={1}
            value={Math.floor(data.gameDurationSeconds / 60)}
            onChange={(e) =>
              update({ gameDurationSeconds: Number(e.target.value) * 60 })
            }
          />
        </div>

        {/*Break duration*/}
        <div className={c.form__row}>
          <header>Перерыв между играми(минут)</header>
          <Input
            type="number"
            max={120}
            min={1}
            value={Math.floor(data.gameBreakDurationSeconds / 60)}
            onChange={(e) =>
              update({ gameBreakDurationSeconds: Number(e.target.value) * 60 })
            }
          />
        </div>

        {/*Start date*/}
        <div className={c.form__row}>
          <header>Время старта(конец подтверждения готовности)</header>
          <DatePicker
            date={new Date(data.startDate)}
            selected={new Date(data.startDate)}
            onChange={(d) => update({ startDate: d!.toISOString() })}
            showTimeSelect
            timeIntervals={1}
            dateFormat={"dd MMMM yyyy HH:mm"}
            customInput={<Input className={cx("iso")} />}
          />
        </div>
        {/*Bracket Type*/}
        <div className={c.form__row}>
          <header>Тип сетки</header>
          <SelectOptions
            options={strategies}
            selected={data.strategy}
            onSelect={(e) => update({ strategy: e.value })}
            defaultText={"Сетка"}
          />
        </div>
        {/*Round best of*/}
        <div className={c.form__row}>
          <header>BestOf: обычные матчи</header>
          <Input
            type="number"
            max={5}
            min={1}
            value={data.roundBestOf}
            onChange={(e) => update({ roundBestOf: Number(e.target.value) })}
          />
        </div>
        {/*Round best of*/}
        <div className={c.form__row}>
          <header>BestOf: финальные матчи</header>
          <Input
            type="number"
            max={5}
            min={1}
            value={data.finalBestOf}
            onChange={(e) => update({ finalBestOf: Number(e.target.value) })}
          />
        </div>
        {/*GrandFinal best of*/}
        {data.strategy === BracketType.DOUBLEELIMINATION && (
          <div className={c.form__row}>
            <header>BestOf: гранд финал</header>
            <Input
              type="number"
              max={5}
              min={1}
              value={data.grandFinalBestOf}
              onChange={(e) =>
                update({ grandFinalBestOf: Number(e.target.value) })
              }
            />
          </div>
        )}

        <Button disabled={isSaving} onClick={saveTournament}>
          {tournament ? "Сохранить" : "Создать"}
        </Button>
      </div>
    );
  },
);
