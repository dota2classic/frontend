import React, { ReactNode, useCallback, useRef } from "react";

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

    const close = useCallback(() => {
      onClose();
    }, [onClose]);

    // const mounted = useDidMount();
    // const closeWhenMounted = useCallback(() => {
    //   if (mounted) {
    //     close();
    //   }
    // }, [close, mounted]);

    // useOutsideClick(closeWhenMounted, comp);
    return (
      <div {...props} ref={ref} className={cx(className, c.modalWrapper)}>
        <div className="modal" ref={comp}>
          <div className={cx(c.header, "modal__header")}>
            {Header ? (
              <Header />
            ) : (
              <span className={c.header__title}>{title}</span>
            )}
            <button className={c.header__closeIcon_button}>
              <IoMdClose
                className={cx(c.header__closeIcon, "close_modal")}
                onClick={close}
              />
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
