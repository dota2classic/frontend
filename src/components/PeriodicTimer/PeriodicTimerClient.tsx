import dynamic from "next/dynamic";

export const PeriodicTimerClient = dynamic(
  () => import("./PeriodicTimer").then((it) => it.PeriodicTimer),
  {
    ssr: false,
  },
);
