import React, { ReactNode, useCallback, useRef } from "react";

import c from "./GenericModal.module.scss";
import cx from "clsx";
import { IoMdClose } from "react-icons/io";
import useOutsideClick from "@/util/useOutsideClick";
import { useDidMount } from "@/util";

interface Props {
  onClose: () => void;
  title: ReactNode;
}

type AllProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  Props;

export const GenericModal = React.forwardRef<HTMLDivElement, AllProps>(
  function GenericModal({ className, title, onClose, ...props }, ref) {
    const comp = useRef<HTMLDivElement | null>(null);

    const mounted = useDidMount();

    const closeWhenMounted = useCallback(() => {
      if (mounted) {
        close();
      }
    }, [mounted]);

    useOutsideClick(closeWhenMounted, comp);
    return (
      <div {...props} ref={ref} className={cx(className, c.modalWrapper)}>
        <div className="modal" ref={comp}>
          <div className={c.header}>
            <span className={c.header__title}>{title}</span>
            <IoMdClose className={c.header__closeIcon} onClick={onClose} />
          </div>
          {props.children}
        </div>
      </div>
    );
  },
);
