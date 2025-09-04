import React, { useEffect, useMemo, useState } from "react";
import c from "./BuySubscriptionModal.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";
import { pluralize } from "@/util/pluralize";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getAuthUrl } from "@/util/getAuthUrl";
import { SubscriptionProductDto } from "@/api/back";
import { FaRubleSign } from "react-icons/fa";
import { FaRegCalendarDays } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useAsyncButton } from "@/util/use-async-button";
import { prepareAuth } from "@/util/prepareAuth";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { GenericModal } from "../GenericModal";

interface IBuySubscriptionModalProps {
  onClose: () => void;
  products: SubscriptionProductDto[];
  onPurchase: (product: SubscriptionProductDto, steamId: string) => void;
}

export const BuySubscriptionModal: React.FC<IBuySubscriptionModalProps> =
  observer(({ onClose, products, onPurchase }) => {
    const { isAuthorized, parsedToken } = useStore().auth;
    const [selectedPlan, setSelectedPlan] = useState(-1);
    const [accept, setAccept] = useState(false);

    useEffect(() => {
      if (selectedPlan === -1) {
        setSelectedPlan(
          [...products].sort((a, b) => b.pricePerMonth - a.pricePerMonth)[0].id,
        );
      }
    }, [products, selectedPlan]);

    const [isStartingPayment, startPayment] = useAsyncButton(async () => {
      const product = products.find((t) => t.id === selectedPlan);
      if (!product) {
        return;
      }

      if (!isAuthorized || !parsedToken) {
        // Authorize
        prepareAuth();
        window.location.href = getAuthUrl();
        return;
      }

      onPurchase(product, parsedToken.sub);
    }, [isAuthorized, selectedPlan, onPurchase]);

    const selectedPlanInfo = useMemo(() => {
      return products.find((t) => t.id === selectedPlan);
    }, [products, selectedPlan]);

    const formValid = useMemo(() => {
      return accept;
    }, [accept]);

    return (
      <GenericModal
        onClose={onClose}
        title={"Купить подписку dotaclassic plus"}
        className={cx(c.modal, NotoSans.className)}
      >
        <div className={c.subscriptionDurations}>
          {products.length > 0
            ? products.map((plan) => {
                const selected = selectedPlan === plan.id;
                return (
                  <div
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cx(c.subItem, selected && c.subItem__selected)}
                    key={plan.months}
                  >
                    <span
                      className={cx(
                        c.selectionIndicator,
                        selected && c.selectionIndicator__selected,
                      )}
                    >
                      {selected ? (
                        <RiCheckboxCircleFill />
                      ) : (
                        <RiCheckboxBlankCircleLine />
                      )}
                    </span>
                    <header>{`${plan.months} ${pluralize(plan.months, "месяц", "месяца", "месяцев")}`}</header>
                    <span className={c.price}>
                      {plan.pricePerMonth}P за месяц
                    </span>
                    {plan.discount !== 0 && (
                      <span className={c.discount}>
                        {(plan.discount * 100).toFixed(0)}% скидка
                      </span>
                    )}
                    {/*<p>{plan.description}</p>*/}
                  </div>
                );
              })
            : "Loading..."}
        </div>
        {selectedPlanInfo && (
          <div className={c.checkoutInfo}>
            <div className={c.checkoutInfo__row}>
              <span>
                <FaRubleSign />
                Цена за месяц
              </span>
              <span>{selectedPlanInfo.pricePerMonth}P</span>
            </div>
            <div className={c.checkoutInfo__row}>
              <span>
                <FaRegCalendarDays />
                Продолжительность
              </span>
              <span>
                {`${selectedPlanInfo.months} ${pluralize(selectedPlanInfo.months, "месяц", "месяца", "месяцев")}`}{" "}
              </span>
            </div>
            <div className={c.checkoutInfo__row}>
              <span>
                <MdDiscount />
                Скидка
              </span>
              <span>
                {selectedPlanInfo.discount
                  ? `${(selectedPlanInfo.discount * 100).toFixed(0)}%`
                  : "Нет :("}
              </span>
            </div>
            <div className={c.delimiter} />
            <div className={c.checkoutInfo__row}>
              <span>
                <FaRegCalendarDays />
                Общая стоимость
              </span>
              <span>
                {selectedPlanInfo.pricePerMonth * selectedPlanInfo.months}P
              </span>
            </div>
            {/*<div className={c.email}>*/}
            {/*  <span>Email</span>*/}
            {/*  <Input*/}
            {/*    placeholder={"Адрес почты для чека"}*/}
            {/*    value={email}*/}
            {/*    type="email"*/}
            {/*    onChange={(e) => setEmail(e.target.value)}*/}
            {/*  />*/}
            {/*</div>*/}
            <div className={c.checkoutInfo__row} style={{ marginTop: 10 }}>
              <Checkbox onChange={setAccept}>
                Я согласен с{" "}
                <a target="__blank" href="/privacy.pdf">
                  обраткой персональных данных
                </a>{" "}
                и{" "}
                <a target="__blank" href="/offer.pdf">
                  офертой.
                </a>
              </Checkbox>
            </div>
          </div>
        )}
        <Button
          disabled={!formValid || isStartingPayment}
          className={cx(TrajanPro.className, c.payButton)}
          onClick={startPayment}
          mega
        >
          {isAuthorized ? "Перейти к оплате" : "Авторизоваться и оплатить"}
        </Button>
      </GenericModal>
    );
  });
