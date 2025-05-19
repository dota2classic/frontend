import { useCallback, useTransition } from "react";

export const useAsyncButton = (
  callback: () => Promise<unknown>,
  deps: unknown[],
): [boolean, () => void] => {
  const [isPending, startTransition] = useTransition();
  const doAction = useCallback(() => {
    startTransition(async () => {
      await callback();
    });
  }, [callback, ...deps]);

  return [isPending, doAction];
};
