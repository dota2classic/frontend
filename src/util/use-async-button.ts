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
      console.log("Transition start")
      await startTransition(async () => {
        console.log("Callback start")
        await callback(...args);
        console.log("Callback end")
      });
      console.log("Transition end")
    },
    [callback, startTransition, ...deps],
  );

  return [isPending, doAction as T];
}
