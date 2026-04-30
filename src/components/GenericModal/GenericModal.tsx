import React, { ReactNode, useCallback, useRef, useEffect, useId } from "react";

import c from "./GenericModal.module.scss";
import cx from "clsx";
import { IoMdClose } from "react-icons/io";

interface Props {
  onClose: () => void;
  title: ReactNode;
  header?: React.FC;
}

type AllProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Props;

export const GenericModal = React.forwardRef<HTMLDivElement, AllProps>(
  function GenericModal(
    { className, title, onClose, header: Header, ...props },
    ref,
  ) {
    const comp = useRef<HTMLDivElement | null>(null);
    const titleId = useId();

    const close = useCallback(
      (e: React.MouseEvent | MouseEvent | KeyboardEvent) => {
        if (e instanceof Event) {
          e.preventDefault();
          e.stopPropagation();
        }
        onClose();
      },
      [onClose],
    );

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close(e);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [close]);

    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) close(e);
      },
      [close],
    );

    return (
      <div
        {...props}
        ref={ref}
        className={cx(className, c.modalWrapper)}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal" ref={comp} onClick={(e) => e.stopPropagation()}>
          <div className={cx(c.header, "modal__header")}>
            {Header ? (
              <Header />
            ) : (
              <span className={c.header__title} id={titleId}>
                {title}
              </span>
            )}
            <button
              className={c.header__closeIcon_button}
              onClick={close}
              aria-label="Close dialog"
            >
              <IoMdClose className={cx(c.header__closeIcon, "close_modal")} />
            </button>
          </div>
          <div className={cx(c.content, "modal__content")}>
            {props.children}
          </div>
        </div>
      </div>
    );
  },
);
