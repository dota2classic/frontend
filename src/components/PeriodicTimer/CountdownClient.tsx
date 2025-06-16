import dynamic from "next/dynamic";

export const CountdownClient = dynamic(
  () => import("./Countdown").then((it) => it.Countdown),
  {
    ssr: false,
  },
);
