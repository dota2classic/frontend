import dynamic from "next/dynamic";

export const PeriodicDurationTimerClient = dynamic(
  () =>
    import("./PeriodicDurationTimer").then((it) => it.PeriodicDurationTimer),
  {
    ssr: false,
  },
);
