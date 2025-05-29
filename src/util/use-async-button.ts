/* eslint-disable */
import { useCallback, useTransition } from "react";

type AsyncFn = (...args: any[]) => Promise<unknown>;

export function useAsyncButton<T extends AsyncFn>(
  callback: T,
  deps: any[],
): [boolean, T] {
  const [isPending, startTransition] = useTransition();
  const doAction = useCallback(
    async (...args: unknown[]) => {
      await startTransition(async () => {
        await callback(...args);
      });
    },
    [callback, ...deps],
  );

  return [isPending, doAction as T];
}
