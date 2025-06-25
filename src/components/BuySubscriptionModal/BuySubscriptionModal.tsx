import React, { useEffect, useMemo, useState } from "react";
import c from "./BuySubscriptionModal.module.scss";
import { Button, Checkbox, GenericModal } from "..";
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
import { setCookie } from "cookies-next";
import { getAuthUrl } from "@/util/getAuthUrl";
import { SubscriptionProductDto } from "@/api/back";
import { FaRubleSign } from "react-icons/fa";
import { FaRegCalendarDays } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useAsyncButton } from "@/util/use-async-button";
import { CountdownClient } from "@/components/PeriodicTimer/CountdownClient";
import { handleException } from "@/util/handleException";

interface IBuySubscriptionModalProps {
  onClose: () => void;
  products: SubscriptionProductDto[];
}

export const BuySubscriptionModal: React.FC<IBuySubscriptionModalProps> =
  observer(({ onClose, products }) => {
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
      if (selectedPlan === -1) {
        return;
      }

      if (!isAuthorized) {
        // Authorize
        setCookie("d2c:auth_redirect", "store", {
          maxAge: 60 * 5 * 24 * 90, // 5 minutes
        });
        window.location.href = getAuthUrl();
        return;
      }

      if (parsedToken?.sub !== "116514945") {
        return;
      }

      try {
        // const result =
        //   await getApi().payment.userPaymentsControllerCreatePayment({
        //     productId: selectedPlan,
        //     email: "enchantinggg4@gmail.com",
        //   });

        // window.location = result;
        return;

        // await redirectWithPost(
        //   `https://pro.selfwork.ru/merchant/v1/init`,
        //   result,
        // );
      } catch (e) {
        await handleException(
          "Произошла ошибка при создании платежа",
          e,
          15000,
        );
        console.error("Failed to create payment", e);
      }
    }, [isAuthorized, selectedPlan]);

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
          {/*{isAuthorized ? "Перейти к оплате" : "Авторизоваться и оплатить"}*/}
          Скоро будет доступно
          <div className={c.countdown}>
            <CountdownClient until="2025-06-26T00:00:00.000Z" />
          </div>
        </Button>
      </GenericModal>
    );
  });
