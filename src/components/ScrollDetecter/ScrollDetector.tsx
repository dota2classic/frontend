import React, { useEffect, useRef } from "react";
import { useIsVisible } from "@/util/useIsVisible";

interface IScrollDetectorProps {
  onScrolledTo: () => void;
}

export const ScrollDetector: React.FC<IScrollDetectorProps> = ({
  onScrolledTo,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      console.log("View detected");
      onScrolledTo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);
  return <span ref={ref} />;
};
