import { useEffect } from "react";

export default function useOutsideClick(onClickOut: () => void, ref: any) {
  console.log("useOutsideClick");
  useEffect(() => {
    const onClick = (e: any) => {
      if (!ref.current || e.nasty) return false;
      return !ref.current?.contains(e.target) && onClickOut?.();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
