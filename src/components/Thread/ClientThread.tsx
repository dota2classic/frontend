import dynamic from "next/dynamic";

export const ClientThread = dynamic(
  () => import("./Thread").then((it) => it.Thread),
  {
    ssr: false,
  },
);
