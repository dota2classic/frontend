import React, { useEffect, useRef } from "react";
import formatDuration from "format-duration";
import { pluralize } from "@/util/pluralize";

const formatDuration2 = (ms: number) => {
  if (ms < 0) ms = -ms;
  const time = {
    д: Math.floor(ms / 86400000),
    ч: Math.floor(ms / 3600000) % 24,
    м: Math.floor(ms / 60000) % 60,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val}${key}`)
    .join(", ");
};

const formatDuration3 = (ms: number) => {
  if (ms < 0) ms = -ms;
  const time = {
    д: Math.floor(ms / 86400000),
    ч: Math.floor(ms / 3600000) % 24,
    м: Math.floor(ms / 60000) % 60,
  };
  const pluralRules: Record<string, string[]> = {
    д: ["день", "дня", "дней"],
    ч: ["час", "часа", "часов"],
    м: ["минута", "минуты", "минут"],
  };

  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => {
      const plural = pluralize(
        val,
        pluralRules[key][0],
        pluralRules[key][1],
        pluralRules[key][2],
      );
      return `${val} ${plural}`;
    })
    .join(", ");
};

interface IDurationProps {
  duration: number;
  big?: boolean;
  long?: boolean;
  interval?: number;
}

export const Duration: React.FC<IDurationProps> = ({
  duration,
  big,
  long,
  interval,
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (!interval || typeof window === "undefined") return;
    const interval2 = setInterval(() => {
      if (!ref.current) return;
      ref.current!.textContent = formatDuration(duration * 1000);
    }, interval);

    return () => clearInterval(interval2);
  }, [interval]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {big
        ? formatDuration2(duration * 1000)
        : long
          ? formatDuration3(duration * 1000)
          : formatDuration(duration * 1000)}
    </span>
  );
};
