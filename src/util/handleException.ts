import { makeSimpleToast } from "@/components/Toast/toasts";
import { ReactNode } from "react";

export const handleException = async (
  title: ReactNode,
  e: unknown,
  time = 5000,
) => {
  let errMsg = "Неизвестная ошибка";
  if (e instanceof Response) {
    const msg = await e.json();
    errMsg = msg.message;
  } else if (e instanceof Error) {
    errMsg = e.message;
  }
  makeSimpleToast(title, errMsg, time, "error");
};
