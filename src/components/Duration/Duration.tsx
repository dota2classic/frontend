import React from "react";
import formatDuration from "format-duration";

// function formatTime(ms: number) {
//   const seconds = Math.floor(Math.abs(ms / 1000));
//   const h = Math.floor(seconds / 3600);
//   const m = Math.floor((seconds % 3600) / 60);
//   const s = Math.round(seconds % 60);
//   const t = [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
//     .filter(Boolean)
//     .join(":");
//
//   return ms < 0 && seconds ? `-${t}` : t;
// }

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

interface IDurationProps {
  duration: number;
  big?: boolean;
}

export const Duration: React.FC<IDurationProps> = ({ duration, big }) => {
  return (
    <>
      {big ? formatDuration2(duration * 1000) : formatDuration(duration * 1000)}
    </>
  );
};
