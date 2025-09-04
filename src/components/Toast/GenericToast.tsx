import React, { ReactNode, useCallback } from "react";
import { ToastContentProps } from "react-toastify";
import c from "./Toast.module.scss";
import { Button } from "../Button";
import cx from "clsx";

export interface GenericToastProps {
  title: ReactNode;
  content?: ReactNode;
  onAccept?: () => void;
  onDecline?: () => void;
  acceptText?: ReactNode;
  declineText?: ReactNode;
  variant?: "simple" | "error";
}
export const GenericToast: React.FC<ToastContentProps & GenericToastProps> = ({
  closeToast,
  title,
  content,
  onAccept,
  acceptText,
  declineText,
  onDecline,
  variant,
}) => {
  const accept = useCallback(() => {
    closeToast();
    onAccept?.();
  }, [closeToast, onAccept]);
  const decline = useCallback(() => {
    closeToast();
    onDecline?.();
  }, [closeToast, onDecline]);

  return (
    <div className={cx(c.toast, variant === "error" && c.toast__error)}>
      <div className={c.content}>
        <header>{title}</header>
        <p>{content}</p>
      </div>
      <div className={c.buttons}>
        {acceptText && (
          <Button onClick={accept} className={c.accept}>
            {acceptText}
          </Button>
        )}
        {declineText && <Button onClick={decline}>{declineText}</Button>}
      </div>
    </div>
  );
};
