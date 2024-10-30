import React, {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useState,
} from "react";

import { Button, PageLink } from "..";

import c from "./NoobFriendlyQueue.module.scss";
import { AppRouter } from "@/route";
import { FaCheck } from "react-icons/fa6";
import cx from "classnames";

interface RequiredStepProps {
  complete: boolean;
  isUpcoming: boolean;
  onComplete: () => void;
  action: ReactNode;
}

const RequiredStep: React.FC<PropsWithChildren<RequiredStepProps>> = (p) => {
  return (
    <div
      className={cx(c.requiredStep, p.isUpcoming && c.requiredStep__upcoming)}
    >
      {p.children}
      <Button
        disabled={p.complete || p.isUpcoming}
        className={cx(c.button, p.complete && c.complete)}
        onClick={!p.complete ? p.onComplete : () => undefined}
      >
        {p.complete ? <FaCheck /> : ""}
        {p.action}
      </Button>
    </div>
  );
};

export const NoobFriendlyQueue = () => {
  const [completeStep, setCompleteStep] = useState(0);

  const markStepComplete = useCallback(
    () => setCompleteStep((t) => t + 1),
    [setCompleteStep],
  );
  return (
    <div className={c.noobQueue}>
      <h1>Как начать играть?</h1>

      <RequiredStep
        onComplete={markStepComplete}
        complete={completeStep > 0}
        isUpcoming={completeStep != 0}
        action="Я скачал и распаковал клиент игры"
      >
        <h2>1) Сначала нужно скачать и распаковать клиент с игрой.</h2>
        <PageLink link={AppRouter.download.link}>
          Скачать его можно тут
        </PageLink>
        <h3>Возможные трудности и их решения:</h3>
        <ul>
          <li>
            xiradoh782 huiman - скорее всего, плохо распаковался архив с игрой.
            Распакуй его заново
          </li>
          <li>
            Долго скачивается - попробуй скачать через torrent или другое облако
          </li>
        </ul>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        complete={completeStep > 1}
        isUpcoming={completeStep != 1}
        action="Игра запускается на моем компьютере"
      >
        <h2>
          2) Теперь тебе нужно запустить игру(dota.exe) в распакованном архиве.{" "}
        </h2>
        <h3>ВНИМАНИЕ: Без запущенного Steam игра работать НЕ БУДЕТ!</h3>
        <h3>Возможные трудности и их решения:</h3>
        <ul>
          <li>
            Steam четотам - ты запустил игру без steam. Закрой клиент, запусти
            steam, и только после этого запускай игру
          </li>
          <li>Не запускается игра - распаковать игру заново</li>
        </ul>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        complete={completeStep > 2}
        isUpcoming={completeStep != 2}
        action="Я смог поиграть с ботами и готов играть с людьми"
      >
        <h2>3) Запусти одиночную игру с ботами</h2>
        <h3>
          СОВЕТ: сыграй несколько игр с ботами, чтобы привыкнуть к старой доте
        </h3>
        <h3>Возможные трудности и их решения:</h3>
        <ul>
          <li>Сильные лаги - сальто с места</li>
          <li>Не хочу смотреть на мужика - новид в косноли</li>
          <li>Квикасты: есть</li>
          <li>Нажатие на себя через альт - нет</li>
        </ul>
        <br />
      </RequiredStep>
    </div>
  );
};
