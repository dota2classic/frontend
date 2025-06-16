import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const ClientPortal = ({
  children,
  visible,
}: PropsWithChildren<{ visible: boolean }>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!visible) return null;

  return createPortal(children, document.body);
};
