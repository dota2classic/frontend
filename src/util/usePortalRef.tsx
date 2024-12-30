import { useMemo } from "react";

export const usePortalRef = (): [string, () => HTMLElement | null] => {
  const random = useMemo(() => `id-${Math.round(Math.random() * 1000000)}`, []);

  return [random, () => document.getElementById(random)];
};
