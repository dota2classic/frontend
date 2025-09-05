import React, { useEffect, useRef } from "react";
import { useFormattedDateTime } from "@/util/dates";

interface IPeriodicTimerProps {
  time: string | number;
}

export const PeriodicTimer: React.FC<IPeriodicTimerProps> = React.memo(
  function PeriodicTimer({ time }) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const formatShortTime = useFormattedDateTime();
    useEffect(() => {
      const interval = setInterval(() => {
        if (!ref.current) return;
        ref.current!.textContent = formatShortTime(new Date(time)) || "";
      }, 5000);

      return () => clearInterval(interval);
    }, [formatShortTime, time]);

    return <span ref={ref}>{formatShortTime(new Date(time))}</span>;
  },
);
