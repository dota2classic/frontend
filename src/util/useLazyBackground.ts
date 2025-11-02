import { RefObject, useEffect, useRef, useState } from "react";

export const useLazyBackground = (
  src: string,
  options: IntersectionObserverInit = { threshold: 0.1 },
): [RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded) {
          setLoaded(true);
          obs.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);

    return () => observer.disconnect();
  }, [src, options, loaded]);

  return [ref, loaded];
};
