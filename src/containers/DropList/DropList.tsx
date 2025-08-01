import React, { useCallback, useMemo, useState } from "react";

import c from "./DropList.module.scss";
import { DroppedItemDto, PlayerSummaryDto, TradeUserDto } from "@/api/back";
import { DropCard } from "@/containers/DropList/DropCard";
import { getApi } from "@/api/hooks";
import { steam32to64, useDidMount } from "@/util";
import { Button, Input, Section } from "@/components";
import { Form } from "@/containers";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { makeLinkToast, makeSimpleToast } from "@/components/Toast/toasts";

interface IDropListProps {
  drops: DroppedItemDto[];
  summary: PlayerSummaryDto;
  user: TradeUserDto;
}

export const DropList: React.FC<IDropListProps> = ({ drops, user }) => {
  const [tradeLink, setTradeLink] = useState(user.tradeUrl || "");
  const [spoiler, setSpoiler] = useState(false);

  const mounted = useDidMount();

  const { data, mutate } = getApi().drops.useItemDropControllerGetMyDrops({
    fallbackData: drops,
    isPaused: () => mounted,
  });

  const { data: dropList, mutate: refreshDrops } =
    getApi().drops.useItemDropControllerGetMyDrops({
      fallbackData: drops,
      refreshInterval: 15000,
    });

  const tradeUrlRegex = useMemo(() => {
    const r = `https:\\/\\/steamcommunity\\.com\\/tradeoffer\\/new\\/\\?partner=${user.steamId}&token=(.+)`;
    console.log(r);
    return new RegExp(r);
  }, [user]);

  const [isUpdating, updateTradeLink] = useAsyncButton(() => {
    return getApi().drops.itemDropControllerUpdateTradeLink({
      tradeUrl: tradeLink,
    });
  }, [tradeLink]);

  const isValidTradeLink = useMemo(() => {
    return tradeUrlRegex.test(tradeLink);
  }, [tradeLink, tradeUrlRegex]);

  const tradeLinkSteam = `https://steamcommunity.com/profiles/${steam32to64(user.steamId)}/tradeoffers/privacy`;

  const [isClaiming, claimDrops] = useAsyncButton(async () => {
    try {
      const offerId = await getApi().drops.itemDropControllerClaimDrops();
      const offerUrl = `https://steamcommunity.com/tradeoffer/${offerId}/`;

      await refreshDrops(undefined, { revalidate: true });

      makeSimpleToast(
        "Создаем предложение к обмену...",
        "Это может занять 5-10 секунд",
        5000,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
      makeLinkToast(
        "Награды предложены к обмену!",
        <>
          <a target="__blank" className="link" href={offerUrl}>
            Перейти к обмену
          </a>
        </>,
        5000,
      );
    } catch (e) {
      await handleException("Ошибка при создании обмена", e);
    }
  }, []);

  const discard = useCallback(
    async (item: DroppedItemDto) => {
      await getApi().drops.itemDropControllerDiscardDrop(item.assetId);
      await mutate(data!.filter((t) => t.assetId !== item.assetId));
    },
    [data],
  );

  return (
    <>
      <Section>
        <header>Настройки</header>

        <Form>
          <div>
            <header>Ссылка на обмен Steam</header>
            <p>
              Чтобы получить награды, нужно сделать инвентарь в Steam
              "открытым", а также предоставить ссылку на обмен. Узнать ее можно{" "}
              <a className="link" target="__blank" href={tradeLinkSteam}>
                по этой ссылке.
              </a>
            </p>
            <p>
              Любой игрок может получить случайную награду после матча в режиме
              Обычная 5х5. Достаточно просто играть!
            </p>
            <a className="link" onClick={() => setSpoiler(!spoiler)}>
              Как найти ссылку на обмен?
            </a>
            {spoiler && <img src="/guide/trade.webp" alt="" />}
            <Input
              onChange={(e) => setTradeLink(e.target.value)}
              value={tradeLink}
              placeholder={"Ссылка на обмен Steam"}
            />
            <span className="red">
              {tradeLink && isValidTradeLink ? "" : "Неверная ссылка"}
            </span>

            <Button
              disabled={isUpdating || !isValidTradeLink}
              onClick={updateTradeLink}
            >
              Сохранить
            </Button>
          </div>
        </Form>
      </Section>

      <Section>
        <header>Награды</header>
        <Button
          disabled={isClaiming || !user.tradeUrl || drops.length === 0}
          mega
          onClick={claimDrops}
        >
          Получить награды
        </Button>
        <br />
        <br />

        <div className={c.list}>
          {dropList!.map((drop) => (
            <DropCard onDiscard={discard} drop={drop} key={drop.assetId} />
          ))}
        </div>
      </Section>
    </>
  );
};
