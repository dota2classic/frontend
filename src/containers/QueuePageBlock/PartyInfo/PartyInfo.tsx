import React, { useCallback, useState } from "react";

import c from "./PartyInfo.module.scss";
import { createPortal } from "react-dom";
import { InvitePlayerModalRaw } from "@/components/InvitePlayerModal";
import cx from "clsx";
import { PartyMemberDTO, UserDTO } from "@/api/back";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { Tooltipable } from "@/components/Tooltipable";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store";
import { makeSimpleToast } from "@/components/Toast";
import { observer } from "mobx-react-lite";
import { IoMdExit } from "react-icons/io";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const PartyInfo: React.FC = observer(() => {
  const { t } = useTranslation();
  const { queue } = useStore();

  const party = queue.party;

  const [inviteOpen, setInviteOpen] = useState(false);

  const close = useCallback(() => setInviteOpen(false), []);

  const invite = useCallback(
    async (it: UserDTO) => {
      queue.inviteToParty(it.steamId);
      makeSimpleToast(
        t("queue_party_info.invitationSent", { name: it.name }),
        "",
        5000,
      );
      close();
    },
    [close, queue, t],
  );

  const partyPlayers: PartyMemberDTO[] = party?.players || [];

  return (
    <QueuePageBlock
      heading={t("queue_page.section.party")}
      icons={
        queue.partySize > 1 ? (
          <>
            <Tooltipable tooltip={t("queue_party_info.leaveGroup")}>
              <IoMdExit onClick={queue.leaveParty} />
            </Tooltipable>
          </>
        ) : undefined
      }
    >
      <div className={c.info}>
        {inviteOpen &&
          createPortal(
            <InvitePlayerModalRaw close={close} onSelect={invite} />,
            document.body,
          )}

        <div className={cx(c.party, "onboarding-party")}>
          {partyPlayers.map((t: PartyMemberDTO) => (
            <PageLink
              key={t.summary.user.steamId}
              link={AppRouter.players.player.index(t.summary.user.steamId).link}
            >
              <div
                className={cx(
                  c.partyItem,
                  t.summary.user.steamId === party?.leader.steamId && c.leader,
                  t.summary.banStatus?.isBanned && c.banned,
                  t.session && c.playing,
                )}
              >
                <img
                  width={50}
                  height={50}
                  src={t.summary.user.avatar || "/avatar.png"}
                  alt=""
                />
              </div>
            </PageLink>
          ))}

          <Tooltipable
            tooltip={t("queue_party_info.inviteToGroup")}
            className={cx(c.partyItem, c.invite)}
          >
            <div
              onClick={(e: React.MouseEvent) => {
                // Some hacking to do
                (e.nativeEvent as { nasty?: boolean }).nasty = true;
                setInviteOpen(true);
              }}
            >
              <img width={50} height={50} src={`/plus.png`} alt="" />
            </div>
          </Tooltipable>
        </div>
      </div>
    </QueuePageBlock>
  );
});
