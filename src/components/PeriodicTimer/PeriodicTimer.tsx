import React, { useEffect, useRef } from "react";
import { fromNow } from "@/util/time";

interface IPeriodicTimerProps {
  time: string | number;
}

export const PeriodicTimer: React.FC<IPeriodicTimerProps> = ({ time }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;
      ref.current!.textContent = fromNow(time) || "";
    }, 5000);

    return () => clearInterval(interval);
  }, [time]);

  return <span ref={ref}>{fromNow(time)}</span>;
};
