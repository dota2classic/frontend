import React, { useEffect } from "react";

export default function useOutsideClick(
  onClickOut: (e: MouseEvent) => void,
  ref: React.RefObject<HTMLElement | null>,
  friends: React.RefObject<HTMLElement | null>[] = [],
) {
  useEffect(() => {
    const onClick = (e: MouseEvent & { nasty?: boolean }) => {
      if (!ref.current || e.nasty) return false;
      const outsideClick =
        [ref]
          .concat(friends)
          .findIndex(
            (ignored) =>
              ignored.current && ignored.current!.contains(e.target as Node),
          ) === -1;
      if (outsideClick) {
        onClickOut(e);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onClickOut, ref]);
}
