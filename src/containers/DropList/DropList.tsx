import React, { useCallback, useMemo, useState } from "react";

import c from "./DropList.module.scss";
import {
  DroppedItemDto,
  PlayerSummaryDto,
  SubscriptionProductDto,
  TradeOfferDto,
  TradeUserDto,
} from "@/api/back";
import { DropCard } from "@/containers/DropList/DropCard";
import { getApi } from "@/api/hooks";
import { steam32to64, useDidMount } from "@/util";
import {
  Button,
  BuySubscriptionModal,
  ClientPortal,
  Input,
  Section,
  Table,
  TimeAgo,
} from "@/components";
import { Form } from "@/containers";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { makeLinkToast, makeSimpleToast } from "@/components/Toast/toasts";
import { useRouter } from "next/router";

interface IDropListProps {
  drops: DroppedItemDto[];
  summary: PlayerSummaryDto;
  user: TradeUserDto;
  trades: TradeOfferDto[];
  products: SubscriptionProductDto[];
}

export const DropList: React.FC<IDropListProps> = ({
  drops,
  trades,
  user,
  products,
}) => {
  const [tradeLink, setTradeLink] = useState(user.tradeUrl || "");
  const [spoiler, setSpoiler] = useState(false);

  const router = useRouter();

  const startPayment = useCallback(() => {
    return router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        checkout: "true",
      },
    });
  }, [router]);

  const endPayment = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checkout, ...rest } = router.query;
    return router.push({
      pathname: router.pathname,
      query: {
        ...rest,
      },
    });
  }, [router]);

  const isCheckout = router.query["checkout"] === "true";

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
  }, [refreshDrops]);

  const discard = useCallback(
    async (item: DroppedItemDto) => {
      const doDiscard = confirm(
        "Ты действительно хочешь отказаться от этого предмета?",
      );

      if (!doDiscard) return;

      await getApi().drops.itemDropControllerDiscardDrop(item.assetId);
      await mutate(data!.filter((t) => t.assetId !== item.assetId));
    },
    [data, mutate],
  );

  return (
    <>
      <ClientPortal visible={isCheckout}>
        <BuySubscriptionModal
          products={products || []}
          onClose={endPayment}
          onPurchase={(product) => {
            getApi()
              .drops.itemDropControllerPurchaseSubscriptionWithTradeBalance({
                productId: product.id,
              })
              .then(async () => {
                await refreshDrops();
                await endPayment();
              })
              .catch((e) => handleException("Ошибка при оплате подписки", e));
          }}
        />
      </ClientPortal>
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
              Любой игрок может получить случайную награду после матча в режиме
              Обычная 5х5. Достаточно просто играть!
            </p>
            <a
              className="link"
              style={{ width: "fit-content" }}
              onClick={() => setSpoiler(!spoiler)}
            >
              Как найти ссылку на обмен?
            </a>
            {spoiler && <img src="/guide/trade.webp" alt="" />}
            <div className="nicerow">
              <Input
                style={{ flex: 1 }}
                onChange={(e) => setTradeLink(e.target.value)}
                value={tradeLink}
                placeholder={"Ссылка на обмен Steam"}
              />

              <Button
                disabled={isUpdating || !isValidTradeLink}
                onClick={updateTradeLink}
              >
                Сохранить
              </Button>
            </div>
            <span className="red">
              {tradeLink && isValidTradeLink ? "" : "Неверная ссылка"}
            </span>
          </div>
        </Form>
      </Section>

      <Section>
        <header>Пожертвовать предметы</header>
        <Form>
          <div>
            <p>
              Любой игрок может пожертвовать проекту вещи в Steam. Бот
              автоматически расчитает стоимость предметов и добавит их к твоему
              внутреннему балансу. Этим балансом можно оплатить подписку!
            </p>
            <a
              style={{ width: "fit-content" }}
              className="link"
              target="__blank"
              href="https://steamcommunity.com/tradeoffer/new/?partner=159907143&token=xczBRmXj"
            >
              Передать предметы
            </a>
            <header>
              Твой баланс: {(user.balance / 100).toFixed(2)} рублей
            </header>
            <Button onClick={startPayment}>Оплатить подписку</Button>

            <header>История обменов</header>
            <Table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Количество предметов</th>
                  <th>Общая сумма</th>
                  <th>Тип обмена</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td>
                      <TimeAgo date={trade.createdAt} />
                    </td>
                    <td>{trade.itemCount}</td>
                    <td>{(trade.amount / 100).toFixed(2)}₽</td>
                    <td>
                      {trade.incoming ? "Пожертвование" : "Выдача награды"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
          {dropList!.length && (
            <h2 className={c.centerHeader}>
              У тебя еще нет наград! Играй, чтобы получить их.
            </h2>
          )}
        </div>
      </Section>
    </>
  );
};
