import React, { useMemo } from "react";
import { GenericModal } from "@/components/GenericModal";
import { PartyInfo } from "@/containers/QueuePageBlock/PartyInfo";
import c from "./TournamentRegisterModal.module.scss";
import { Button } from "@/components/Button";
import { TournamentDto, UserDTO } from "@/api/back";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { useAsyncButton } from "@/util/use-async-button";
import { getApi } from "@/api/hooks";
import { handleException } from "@/util/handleException";
import { UserPreview } from "@/components/UserPreview";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { makeSimpleToast } from "@/components/Toast";
import { FaExclamation } from "react-icons/fa";

interface ITournamentRegisterModalProps {
  onClose: () => void;
  onRegister: (regId: number) => void;
  tournament: TournamentDto;
}

export const TournamentRegisterModal: React.FC<ITournamentRegisterModalProps> =
  observer(({ onClose, tournament, onRegister }) => {
    const party = useStore().queue.party;

    const alreadyRegisteredMembers: UserDTO[] = useMemo(() => {
      if (!party) return [];
      const registeredPlayers: string[] = tournament.registrations.flatMap(
        (t) => t.players.flatMap((t) => t.user.steamId),
      );
      return party.players
        .filter((t) => registeredPlayers.includes(t.summary.user.steamId))
        .map((t) => t.summary.user);
    }, [party, tournament]);

    // FIXME: make this extractable
    const maxMmr = tournament.id === 3 ? 3000 : 10000;

    const badMmrMembers: UserDTO[] = useMemo(() => {
      if (!party) return [];
      return party.players
        .filter((t) => (t.summary.seasonStats.mmr || 0) > maxMmr)
        .map((t) => t.summary.user);
    }, [party, maxMmr]);

    const maxMmrValid = badMmrMembers.length === 0;
    const isValid =
      alreadyRegisteredMembers.length === 0 &&
      maxMmrValid &&
      (party?.players?.length || 100) <= tournament.teamSize;

    const [isActive, register] = useAsyncButton(async () => {
      try {
        const registrationId =
          await getApi().tournament.tournamentControllerRegister(tournament.id);
        onClose();
        onRegister(registrationId);
        makeSimpleToast("Успех", "Ты зарегистрировался на турнир");
      } catch (e) {
        await handleException("Ошибка при регистрации на турнир", e, 30000);
      }
    }, [tournament.id]);

    return (
      <GenericModal
        className={cx(c.modal, NotoSans.className)}
        title={"Регистрация в турнире"}
        onClose={onClose}
      >
        <PartyInfo />
        <h3 className={c.teamSize}>
          Игроков в команде: {party?.players?.length || "-"} из{" "}
          {tournament.teamSize}
        </h3>
        <p>
          Если в вашей группе не хватает игроков для полноценной команды,
          система попробует заполнить нехватающие места другими игроками
        </p>

        {badMmrMembers.length > 0 && (
          <QueuePageBlock
            icons={<FaExclamation />}
            heading="Игроки не подходят по рейтингу"
          >
            <div className={c.error}>
              {badMmrMembers.map((usr) => (
                <UserPreview key={usr.steamId} user={usr} />
              ))}
            </div>
          </QueuePageBlock>
        )}

        {alreadyRegisteredMembers.length > 0 && (
          <QueuePageBlock
            icons={<FaExclamation />}
            heading="Игроки уже зарегистрированы"
          >
            <div className={c.error}>
              {alreadyRegisteredMembers.map((usr) => (
                <UserPreview key={usr.steamId} user={usr} />
              ))}
            </div>
          </QueuePageBlock>
        )}

        <div className={c.spacer} />
        <Button
          disabled={!isValid || isActive}
          onClick={register}
          variant="primary"
        >
          Участвовать этим составом
        </Button>
      </GenericModal>
    );
  });
