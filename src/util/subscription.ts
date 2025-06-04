/* eslint-disable */

import {__unsafeGetClientStore} from "@/store";

type AsyncFn = (...args: any[]) => Promise<unknown>;

export function paidAction<T extends AsyncFn>(callback: T): T {
  return (async (...args: any[]) => {
    const isOld = __unsafeGetClientStore().auth.isOld;
    if (!isOld) {
      __unsafeGetClientStore().sub.show();
      return;
    }
    await callback(...args);
  }) as T;
}
