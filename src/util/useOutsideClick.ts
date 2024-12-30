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

export function useOutsideClick2(
  onClickOut: (e: MouseEvent) => void,
  ref: HTMLElement | null,
  friends: (HTMLElement | null)[] = [],
) {
  useEffect(() => {
    const onClick = (e: MouseEvent & { nasty?: boolean }) => {
      if (!ref || e.nasty) return false;
      const outsideClick =
        ([ref] as (HTMLElement | null)[])
          .concat(friends)
          .findIndex(
            (ignored) => ignored && ignored!.contains(e.target as Node),
          ) === -1;
      if (outsideClick) {
        onClickOut(e);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onClickOut, ref]);
}
