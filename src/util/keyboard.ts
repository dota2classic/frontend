import { useEffect, useState } from "react";

export const useKeyDown = (key: string) => {
  const [keyDown, setKeyDown] = useState(false);
  useEffect(() => {
    const listener = (val: boolean) => (e: KeyboardEvent) => {
      if (e.key === key) {
        setKeyDown(val);
      }
    };

    const keydown = listener(true);
    const keyup = listener(false);
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };
  }, [setKeyDown, key]);

  return keyDown;
};
