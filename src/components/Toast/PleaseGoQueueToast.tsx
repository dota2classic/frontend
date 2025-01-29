import React from "react";
import { ToastContentProps } from "react-toastify";
import { MatchmakingMode } from "@/api/mapped-models";
import { useRouter } from "next/router";
import { GenericToast } from "@/components";
import { formatGameMode } from "@/util/gamemode";
import { AppRouter } from "@/route";

export const PleaseGoQueueToast: React.FC<
  Partial<ToastContentProps> & { inQueue: number; mode: MatchmakingMode }
> = (props) => {
  const fixedProps = props as ToastContentProps & {
    inQueue: number;
    mode: MatchmakingMode;
  };
  const router = useRouter();
  return (
    <GenericToast
      {...props}
      title={
        <>
          Давай поиграем в <br />
          <span className="gold">{formatGameMode(props.mode)}</span>?
        </>
      }
      content={<>Там уже {props.inQueue} в поиске!</>}
      acceptText={"Уже иду"}
      onAccept={() =>
        router.push(AppRouter.queue.link.href, AppRouter.queue.link.as)
      }
      declineText={"Потом"}
      onDecline={props.closeToast}
      {...fixedProps}
    />
  );
};
