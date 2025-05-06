import React, { useEffect, useRef } from "react";
import formatDuration from "format-duration";

interface IPeriodicTimerProps {
  startTime: string | number;
  updateInterval?: number;
}

const getTextContent = (start: string | number) =>
  formatDuration(Date.now() - new Date(start).getTime());

export const PeriodicDurationTimer: React.FC<IPeriodicTimerProps> = React.memo(
  function PeriodicTimer({ startTime, updateInterval }) {
    const ref = useRef<HTMLSpanElement | null>(null);
    useEffect(() => {
      const interval = setInterval(() => {
        if (!ref.current) return;
        ref.current!.textContent = getTextContent(startTime);
      }, updateInterval || 1000);

      return () => clearInterval(interval);
    }, [startTime, updateInterval]);

    return <span ref={ref}>{getTextContent(startTime)}</span>;
  },
);
