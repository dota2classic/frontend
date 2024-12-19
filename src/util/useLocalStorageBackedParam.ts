import { useCallback, useState } from "react";

export const useLocalStorageBackedParam = <T>(
  key: string,
  initial?: T,
): [T | undefined, (v: T) => void] => {
  const ls = localStorage.getItem(key);
  const [state, setState] = useState<T | undefined>(
    ls ? JSON.parse(ls) : initial,
  );

  const setValue = useCallback((value: T | undefined) => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    } else {
      localStorage.removeItem(key);
      setState(undefined);
    }
  }, []);

  if (typeof window === "undefined") return [initial, () => undefined];

  return [state, setValue];
};
