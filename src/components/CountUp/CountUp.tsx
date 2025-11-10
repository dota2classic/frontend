import React, { useEffect, useRef } from "react";

interface ICountUpProps {
  end: number;
  duration?: number;
  onComplete?: () => void;
  decimals?: number;
}

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> &
  ICountUpProps;
export const CountUp: React.FC<Props> = ({
  end,
  duration = 2000,
  onComplete,
  decimals = 0,
  ...props
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let start: number | null = null;

    // Sine ease-out: starts fast, slows down smoothly
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const rawProgress = (timestamp - start) / duration;
      const progress = Math.min(rawProgress, 1);
      const easedProgress = easeOutSine(progress);
      const value = parseFloat((easedProgress * end).toFixed(decimals));

      if (ref.current) {
        ref.current!.textContent = value.toString();
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, decimals, onComplete]);

  return (
    <span {...props} ref={ref}>
      0
    </span>
  );
};
