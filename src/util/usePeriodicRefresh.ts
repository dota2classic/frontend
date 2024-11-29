import { useEffect, useState } from "react";

export function usePeriodicRefresh<T>(
  cb: () => T,
  timer: number,
  deps: unknown[],
): T {
  const [state, setState] = useState<T>(cb());
  useEffect(() => {
    const interval = setInterval(() => {
      setState(cb());
    }, timer);

    return () => clearInterval(interval);
  }, deps);

  return state;
}
