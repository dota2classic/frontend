import { BackendCache } from "@/store/BackendCache";
import { performance } from "perf_hooks";

export function measure<T>(msg: string, lambda: () => T) {
  const start = performance.now();
  const r = lambda();
  const duration = performance.now() - start;
  console.log(`[${msg}] - ${duration}`);

  return r;
}

export async function cachedBackendRequest<Response>(
  request: () => Promise<Response>,
  cacheKey: string,
  cacheProps: unknown[],
  cacheTtl: number,
) {
  const compositeKey = JSON.stringify({
    cacheKey,
    cacheProps: cacheProps.sort(),
  });
  const some = await BackendCache.get<Response>(compositeKey);
  if (!some) {
    const freshData = await request();
    await BackendCache.set(compositeKey, freshData, cacheTtl);

    return JSON.parse(JSON.stringify(freshData));
  }
  return some;
}
