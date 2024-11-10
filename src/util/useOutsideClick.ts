import React, { useEffect } from "react";

export default function useOutsideClick(
  onClickOut: () => void,
  ref: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const onClick = (e: MouseEvent & { nasty?: boolean }) => {
      if (!ref.current || e.nasty) return false;
      return !ref.current!.contains(e.target as Node) && onClickOut?.();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onClickOut, ref]);
}
