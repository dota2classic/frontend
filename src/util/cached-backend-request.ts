export async function cachedBackendRequest<Response>(
  request: () => Promise<Response>,
  cacheKey: string,
  cacheProps: unknown[],
  cacheTtl: number,
) {
  if (typeof window !== "undefined") {
    console.log("Browser: no redis caching here");
    return request();
  }
  const BackendCache = (await import("@/store/BackendCache")).BackendCache;
  const compositeKey = JSON.stringify({
    cacheKey,
    cacheProps: cacheProps.sort(),
  });
  console.log(compositeKey);
  const some = await BackendCache.get<Response>(compositeKey);
  if (!some) {
    const freshData = await request();
    await BackendCache.set(compositeKey, freshData, cacheTtl);
    console.log("No cached data: refetched");

    return freshData;
  }

  console.log("Returning cached data! Cool!");
  return some;
}
