export function ttlMemo<T>(
  fn: () => Promise<T>,
  ttlMs: number,
): () => Promise<T> {
  let cached: { value: Promise<T>; expiresAt: number } | undefined;

  return () => {
    const now = Date.now();
    if (!cached || cached.expiresAt <= now) {
      const value = fn();
      const entry = { value, expiresAt: now + ttlMs };
      cached = entry;
      value.catch(() => {
        if (cached === entry) cached = undefined;
      });
    }
    return cached.value;
  };
}
