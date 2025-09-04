import React, { ReactNode } from "react";
import { ToastContentProps } from "react-toastify";
import { GenericToast } from "./GenericToast";

export const SimpleToast: React.FC<
  Partial<ToastContentProps> & {
    title: ReactNode;
    content: ReactNode;
    variant: "simple" | "error";
  }
> = (props) => {
  const fixedProps = props as ToastContentProps & {
    title: ReactNode;
    content: ReactNode;
  };
  return <GenericToast {...fixedProps} />;
};
