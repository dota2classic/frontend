/* eslint-disable */

import { __unsafeGetClientStore } from "@/store";
import { Role, UserDTO } from "@/api/back";
import { isInFuture } from "@/util/time";

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

export const hasSubscription = (user: UserDTO): boolean => {
  return (
    user.roles.findIndex(
      (t) => t.role === Role.OLD && isInFuture(t.endTime),
    ) !== -1
  );
};
