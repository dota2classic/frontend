import React from "react";
import { ToastContentProps } from "react-toastify";
import { MatchmakingMode } from "@/api/mapped-models";
import { useRouter } from "next/router";
import { GenericToast } from "./GenericToast";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";

export const PleaseGoQueueToast: React.FC<
  Partial<ToastContentProps> & { inQueue: number; mode: MatchmakingMode }
> = (props) => {
  const fixedProps = props as ToastContentProps & {
    inQueue: number;
    mode: MatchmakingMode;
  };
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <GenericToast
      {...props}
      title={
        <>
          {" "}
          {t("please_go_queue.titlePart1")} <br />
          <span className="gold">{t(`matchmaking_mode.${props.mode}`)}</span>
          ?{" "}
        </>
      }
      content={
        <> {t("please_go_queue.queueInfo", { inQueue: props.inQueue })} </>
      }
      acceptText={t("please_go_queue.acceptText")}
      onAccept={() =>
        router.push(AppRouter.queue.link.href, AppRouter.queue.link.as)
      }
      declineText={t("please_go_queue.declineText")}
      onDecline={props.closeToast}
      {...fixedProps}
    />
  );
};
