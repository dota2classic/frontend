import React, { ReactNode } from "react";
import { ToastContentProps } from "react-toastify";
import { GenericToast } from "@/components";

export const SimpleToast: React.FC<
  Partial<ToastContentProps> & { title: ReactNode; content: ReactNode }
> = (props) => {
  const fixedProps = props as ToastContentProps & {
    title: ReactNode;
    content: ReactNode;
  };
  return <GenericToast {...fixedProps} />;
};
