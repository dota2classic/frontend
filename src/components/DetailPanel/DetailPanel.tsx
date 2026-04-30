import React from "react";
import cx from "clsx";
import { Surface } from "@/components/Surface";
import c from "./DetailPanel.module.scss";

interface DetailPanelProps extends React.ComponentProps<typeof Surface> {
  lead?: React.ReactNode;
  stackClassName?: string;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  className,
  lead,
  stackClassName,
  children,
  padding = "md",
  variant = "surface",
  ...props
}) => {
  return (
    <Surface
      {...props}
      className={cx(c.panel, className)}
      padding={padding}
      variant={variant}
    >
      {lead !== undefined ? (
        <div className={cx(c.stack, stackClassName)}>
          <p className={c.lead}>{lead}</p>
          {children}
        </div>
      ) : (
        children
      )}
    </Surface>
  );
};
