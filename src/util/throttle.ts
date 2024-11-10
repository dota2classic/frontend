import { useRef } from "react";

export function throttle<T>(fn: () => T, wait: number) {
  let shouldWait = false;

  return function () {
    console.log(`Calling. should wait? ${shouldWait}`);
    if (!shouldWait) {
      fn();
      shouldWait = true;
      setTimeout(() => (shouldWait = false), wait);
    }
  };
}

export function useThrottle(cb: () => void, limit: number) {
  const lastRun = useRef(Date.now());

  return function () {
    if (Date.now() - lastRun.current >= limit) {
      cb(); // Execute the callback
      lastRun.current = Date.now(); // Update last execution time
    }
  };
}
