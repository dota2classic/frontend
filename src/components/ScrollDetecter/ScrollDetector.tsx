import React, { useEffect, useRef, useState } from "react";

interface IScrollDetectorProps {
  onScrolledTo: () => void;
}

export function useIsVisible(ref: React.RefObject<HTMLDivElement>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

export const ScrollDetector: React.FC<IScrollDetectorProps> = ({
  onScrolledTo,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible) onScrolledTo();
  }, [isVisible]);
  return <span ref={ref} />;
};
