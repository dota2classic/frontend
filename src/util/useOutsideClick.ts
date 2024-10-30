import React, { useEffect } from "react";

export default function useOutsideClick(
  onClickOut: () => void,
  ref: React.RefObject<unknown>,
) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current || e["nasty"]) return false;
      return !ref.current?.contains(e.target) && onClickOut?.();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [onClickOut, ref]);
}
