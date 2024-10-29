export interface StoreProvider {
  setItem(key: string, value: string | null): void;

  getItem(key: string): string | null;

  removeItem(key: string): void;
}

interface StoredValue {
  data: any;
  createTime: number;
}

export interface CacheOptions {
  ttl: number;
  cacheableKeys: string[];
}

export class StoreWrapper {
  constructor(
    public readonly store: StoreProvider,
    private readonly options: CacheOptions,
  ) {}

  public get<T>(key: string) {
    const d = this.store.getItem(key);
    if (!d) return null;

    const sv: StoredValue = JSON.parse(d);
    if (new Date().getTime() - sv.createTime >= this.options.ttl) {
      // Invalidated
      this.store.setItem(key, null);
      return null;
    }

    return sv.data as T;
  }

  public set<T>(key: string, value: T | null, ttl = this.options.ttl) {
    this.store.setItem(
      key,
      JSON.stringify({
        data: value,
        createTime: new Date().getTime(),
      } satisfies StoredValue),
    );
  }
}

const createUniversalCache = () => {
  if (typeof window === "undefined") {
    // Create in memory cache
    const map = new Map();

    return new StoreWrapper(
      {
        getItem(key: string): string | null {
          return map.get(key);
        },
        setItem(key: string, value: string) {
          return map.set(key, value);
        },
        removeItem(key: string) {
          map.delete(key);
        },
      },
      {
        ttl: 10_000,
        cacheableKeys: [],
      },
    );
  } else {
    // Create localStorageCache
    return new StoreWrapper(localStorage, {
      ttl: 10_000,
      cacheableKeys: [],
    });
  }
};

let cache: StoreWrapper | undefined;

export const getCache = () => {
  if (cache) return cache;

  cache = createUniversalCache();
  return cache;
};
