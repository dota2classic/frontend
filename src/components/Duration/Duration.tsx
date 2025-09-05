import React, { useEffect, useRef } from "react";
import formatDuration from "format-duration";
import { useFormattedDuration, useLongFormattedDuration } from "@/util/dates";

interface IDurationProps {
  duration: number;
  big?: boolean;
  long?: boolean;
  interval?: number;
}

export const Duration: React.FC<IDurationProps> = ({
  duration,
  long,
  interval,
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
        : formatShortDuration(duration * 1000)}
    </span>
  );
};
