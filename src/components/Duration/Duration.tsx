import React, { useEffect, useRef } from "react";
import { useFormattedDuration, useLongFormattedDuration } from "@/util/dates";
import formatDuration from "format-duration";

interface IDurationProps {
  duration: number;
  long?: boolean;
  interval?: number;
  clock?: boolean;
}

export const Duration: React.FC<IDurationProps> = ({
  duration,
  long,
  interval,
  clock,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const formatShortDuration = useFormattedDuration();
  const formatLongDuration = useLongFormattedDuration();

  useEffect(() => {
    if (!interval || typeof window === "undefined") return;
    const interval2 = setInterval(() => {
      if (!ref.current) return;
      ref.current!.textContent = formatDuration(duration * 1000);
    }, interval);

    return () => clearInterval(interval2);
  }, [duration, interval]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {long
        ? formatLongDuration(duration * 1000)
        : clock
          ? formatDuration(duration * 1000)
          : formatShortDuration(duration * 1000)}
    </span>
  );
};
