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
import cx from "clsx";
import { useStore } from "@/store";
import { FaSteam } from "react-icons/fa";
import { getAuthUrl } from "@/util/getAuthUrl";

interface RequiredStepProps {
  onComplete: () => void;
  action: ReactNode;
  step: number;
  currentStep: number;
}

const RequiredStep: React.FC<PropsWithChildren<RequiredStepProps>> = (p) => {
  const isUpcoming = p.currentStep != p.step;
  const isComplete = p.step > p.currentStep;
  return (
    <div className={cx(c.requiredStep, isUpcoming && c.requiredStep__upcoming)}>
      {p.children}
      <Button
        disabled={isComplete || isUpcoming}
        className={cx(c.button, isComplete && c.complete)}
        onClick={!isComplete ? p.onComplete : () => undefined}
      >
        {isComplete ? <FaCheck /> : ""}
        {p.action}
      </Button>
    </div>
  );
};

export const NoobFriendlyQueue = () => {
  const { auth } = useStore();
  const [completeStep, setCompleteStep] = useState(auth.parsedToken ? 1 : 0);

  const markStepComplete = useCallback(
    () => setCompleteStep((t) => t + 1),
    [setCompleteStep],
  );
  return (
    <div className={c.noobQueue}>
      <h1>Как начать играть?</h1>

      <RequiredStep
        onComplete={markStepComplete}
        currentStep={completeStep}
        action={
          <a
            href={getAuthUrl()}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FaSteam style={{ marginRight: 4 }} />
            Войти
          </a>
        }
        step={0}
      >
        <h2>1) Нужно авторизоваться на сайте через Steam</h2>
        <br />
      </RequiredStep>

      <RequiredStep
        onComplete={markStepComplete}
        currentStep={completeStep}
        action="Я скачал и распаковал клиент игры"
        step={1}
      >
        <h2>2) Сначала нужно скачать и распаковать клиент с игрой.</h2>
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
        step={2}
        currentStep={completeStep}
        action="Игра запускается на моем компьютере"
      >
        <h2>
          3) Теперь тебе нужно запустить игру(dota.exe) в распакованном архиве.{" "}
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
        currentStep={completeStep}
        step={3}
        action="Я смог поиграть с ботами и готов играть с людьми"
      >
        <h2>4) Запусти одиночную игру с ботами</h2>
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
