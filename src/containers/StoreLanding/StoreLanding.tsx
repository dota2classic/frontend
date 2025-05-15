import React, { useCallback } from "react";

import c from "./StoreLanding.module.scss";
import { getApi } from "@/api/hooks";
import { makeSimpleToast } from "@/components/Toast/toasts";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import { TrajanPro } from "@/const/fonts";
import { Button } from "@/components";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getAuthUrl } from "@/util/getAuthUrl";
import { setCookie } from "cookies-next";

export const StoreLanding = observer(() => {
  const { isAuthorized } = useStore().auth;
  const startPayment = useCallback(async () => {
    if (!isAuthorized) {
      // Authorize
      setCookie("d2c:auth_redirect", "store", {
        maxAge: 60 * 5 * 24 * 90, // 5 minutes
      });
      window.location.href = getAuthUrl();
    }

    try {
      const result =
        await getApi().payment.userPaymentsControllerCreatePayment();
      window.location.href = result.confirmationUrl;
    } catch (e) {
      makeSimpleToast(
        "Произошла ошибка при создании платежа",
        "Произошла ошибка на стороне платежной системе. Извиняемся за неудобства",
        15000,
      );
      console.error("Failed to create payment", e);
    }
  }, [isAuthorized]);

  return (
    <div className={cx(c.root, NotoSans.className)}>
      <h1 className={cx(c.title, c.shinyText, TrajanPro.className)}>
        DOTACLASSIC PLUS
      </h1>
      <h2 className={cx(c.subTitle, TrajanPro.className)}>
        Для истинных ценителей классики
      </h2>
      <p className={c.description}>
        Огромная поддержка в развитии старой доты - помогая проекту, ты напрямую
        влияешь на повышение онлайна, качества игр и разработку нового
        функционала.
      </p>

      <Button
        onClick={startPayment}
        className={cx(TrajanPro.className, c.payButton)}
        mega
      >
        Подписаться на месяц 300p
      </Button>

      <div className={cx(c.sectionHeader, TrajanPro.className)}>
        <h2 className={c.shinyTextLight}>Кастомизация профиля</h2>
      </div>
      <div className={c.imageInfo}>
        <p>
          Декорация профиля на сайте - подбери идеальную шапку, иконку
          подписчика и титул!
        </p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/9d959f25afbff49333ff4cd49f0183d04c2def9b4690cd70e3da4ef12d55b40a.webp"
          alt=""
        />
      </div>
      <div className={cx(c.imageInfo, c.reversed)}>
        <p>Выбери цвет для никнейма в самой игре</p>
        <img
          src="https://images.steamusercontent.com/ugc/262717915356174744/DFCC070DC5DB468AFE363406A37070E421B6D1E4/"
          alt=""
        />
      </div>

      <div className={cx(c.sectionHeader, TrajanPro.className)}>
        <h2 className={c.shinyTextLight}>Лобби и перекалибровка</h2>
      </div>
      <div className={cx(c.imageInfo, c.reversed)}>
        <p>Раз в сезон ты можешь сбросить рейтинг и пройти калибровку заново</p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"
          alt=""
        />
      </div>

      <div className={c.imageInfo}>
        <p>Создавай свои лобби с паролем и полной настройкой запуска</p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/7db43368315457956bf3bac1195795c6cf2f7f3638a02cd40c4171b934efcf20.webp"
          alt=""
        />
      </div>

      <div className={cx(c.sectionHeader, TrajanPro.className)}>
        <h2 className={c.shinyTextLight}>Избегай неприятелей</h2>
      </div>
      <div className={cx(c.imageInfo)}>
        <p>
          Не нравится чье-то общение в чате? Заблокируй его и не увидишь его
          сообщения
        </p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"
          alt=""
        />
      </div>

      <div className={cx(c.imageInfo, c.reversed)}>
        <p>
          Тебе доступен список избегаемых игроков - вы никогда не будете за одну
          команду.
        </p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"
          alt=""
        />
      </div>

      <div className={cx(c.sectionHeader, TrajanPro.className)}>
        <h2 className={c.shinyTextLight}>Похвала и разбан героя</h2>
      </div>
      <div className={cx(c.imageInfo)}>
        <p>
          Очень хотел поиграть на герое, а он как раз в бане? Ты можешь
          разбанить одного героя для всех.
        </p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"
          alt=""
        />
      </div>

      <div className={cx(c.imageInfo, c.reversed)}>
        <p>
          Для любителей "типов": 3 раза за игру можно похвалить другого игрока
        </p>
        <img
          src="https://cdn.dotaclassic.ru/public/upload/6ddab40d2e5ee22cea922abfba1eeee7d7f460d5dfe2dcdec40f03a9150dfa5c.webp"
          alt=""
        />
      </div>

      <Button className={cx(TrajanPro.className, c.payButton)} mega>
        Подписаться на месяц 300p
      </Button>
    </div>
  );
});
