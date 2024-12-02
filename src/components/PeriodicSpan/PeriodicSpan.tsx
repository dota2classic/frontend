import React, { useEffect, useRef } from "react";

interface IPeriodicSpanProps {
  interval: number;
  producer: () => string;
}

export const PeriodicSpan: React.FC<IPeriodicSpanProps> = ({
  interval,
  producer,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!interval || typeof window === "undefined") return;
    const interval2 = setInterval(() => {
      if (!ref.current) return;
      ref.current!.textContent = producer();
    }, interval);

    return () => clearInterval(interval2);
  }, [interval]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {producer()}
    </span>
  );
};
