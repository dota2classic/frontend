import React, { useCallback, useMemo, useState } from "react";

import c from "./DropList.module.scss";
import {
  DroppedItemDto,
  PlayerSummaryDto,
  SubscriptionProductDto,
  TradeOfferDto,
  TradeUserDto,
} from "@/api/back";
import { DropCard } from "./DropCard";
import { getApi } from "@/api/hooks";
import { steam32to64 } from "@/util/steamId";
import { useDidMount } from "@/util/useDidMount";
import { Form } from "../Form";
import { useAsyncButton } from "@/util/use-async-button";
import { handleException } from "@/util/handleException";
import { makeLinkToast, makeSimpleToast } from "@/components/Toast";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { ClientPortal } from "@/components/ClientPortal";
import { BuySubscriptionModal } from "@/components/BuySubscriptionModal";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Table } from "@/components/Table";
import { TimeAgo } from "@/components/TimeAgo";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

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
  const { t } = useTranslation();
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
    const r = `https:\/\/steamcommunity\.com\/tradeoffer\/new\/\\?partner=${user.steamId}&token=(.+)`;
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
        t("drop_list.creatingTradeOffer"),
        t("drop_list.itMayTakeTime"),
        5000,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
      makeLinkToast(
        t("drop_list.rewardsOffered"),
        <>
          <a target="__blank" className="link" href={offerUrl}>
            {t("drop_list.goToTrade")}
          </a>
        </>,
        5000,
      );
    } catch (e) {
      await handleException(t("drop_list.errorCreatingTrade"), e);
    }
  }, [refreshDrops]);

  const discard = useCallback(
    async (item: DroppedItemDto) => {
      const doDiscard = confirm(t("drop_list.confirmDiscard"));

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
              .catch((e) =>
                handleException(t("drop_list.errorPurchasingSubscription"), e),
              );
          }}
        />
      </ClientPortal>
      <QueuePageBlock className={c.fullwidth} heading={t("drop_list.settings")}>
        <Form>
          <div>
            <header>{t("drop_list.tradeLinkHeader")}</header>
            <p>{t("drop_list.tradeLinkInfo", { tradeLinkSteam })}</p>
            <a
              className="link"
              style={{ width: "fit-content" }}
              onClick={() => setSpoiler(!spoiler)}
            >
              {t("drop_list.howToFindTradeLink")}
            </a>
            {spoiler && <img src="/guide/trade.webp" alt="" />}
            <div className="nicerow">
              <Input
                style={{ flex: 1 }}
                onChange={(e) => setTradeLink(e.target.value)}
                value={tradeLink}
                placeholder={t("drop_list.tradeLinkPlaceholder")}
              />

              <Button
                disabled={isUpdating || !isValidTradeLink}
                onClick={updateTradeLink}
              >
                {t("drop_list.save")}
              </Button>
            </div>
            {tradeLink && (
              <span className={isValidTradeLink ? "green" : "red"}>
                {isValidTradeLink
                  ? t("drop_list.validLink")
                  : t("drop_list.invalidLink")}
              </span>
            )}
          </div>
        </Form>
      </QueuePageBlock>

      <QueuePageBlock
        className={c.fullwidth}
        heading={t("drop_list.donateItems")}
      >
        <Form>
          <div>
            <p>{t("drop_list.donationInfo")}</p>
            <a
              style={{ width: "fit-content" }}
              className="link"
              target="__blank"
              href="https://steamcommunity.com/tradeoffer/new/?partner=159907143&token=xczBRmXj"
            >
              {t("drop_list.transferItems")}
            </a>
            <header>
              {t("drop_list.yourBalance", {
                balance: (user.balance / 100).toFixed(2),
              })}
            </header>
            <Button onClick={startPayment}>
              {t("drop_list.paySubscription")}
            </Button>

            <header>{t("drop_list.historyOfTrades")}</header>
            <Table>
              <thead>
                <tr>
                  <th>{t("drop_list.date")}</th>
                  <th>{t("drop_list.itemCount")}</th>
                  <th>{t("drop_list.totalAmount")}</th>
                  <th>{t("drop_list.tradeType")}</th>
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
                      {trade.incoming
                        ? t("drop_list.donation")
                        : t("drop_list.rewardGiving")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Form>
      </QueuePageBlock>

      <QueuePageBlock className={c.fullwidth} heading={t("drop_list.rewards")}>
        {drops.length > 0 && (
          <>
            <Button
              disabled={isClaiming || !user.tradeUrl || drops.length === 0}
              mega
              onClick={claimDrops}
            >
              {t("drop_list.getRewards")}
            </Button>
            <br />
            <br />
            <br />
          </>
        )}
        <div className={c.list}>
          {dropList!.map((drop) => (
            <DropCard onDiscard={discard} drop={drop} key={drop.assetId} />
          ))}
          {dropList!.length == 0 && (
            <h2 className={c.centerHeader}>{t("drop_list.noRewards")}</h2>
          )}
        </div>
      </QueuePageBlock>
    </>
  );
};
