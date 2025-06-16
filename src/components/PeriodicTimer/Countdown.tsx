import formatDuration from "format-duration";
import React, { useEffect, useRef } from "react";

interface IPeriodicTimerProps {
  until: string | number;
  updateInterval?: number;
}

const getTextContent = (start: string | number) =>
  formatDuration(new Date(start).getTime() - Date.now());

export const Countdown: React.FC<IPeriodicTimerProps> = React.memo(
  function PeriodicTimer({ until, updateInterval }) {
    const ref = useRef<HTMLSpanElement | null>(null);
    useEffect(() => {
      const interval = setInterval(() => {
        if (!ref.current) return;
        ref.current!.textContent = getTextContent(until);
      }, updateInterval || 1000);

      return () => clearInterval(interval);
    }, [until, updateInterval]);

    return <span ref={ref}>{getTextContent(until)}</span>;
  },
);
