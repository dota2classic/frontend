import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SurfaceHeader } from "@/components/SurfaceHeader";

interface PageHeaderProps
  extends Omit<React.ComponentProps<typeof SurfaceHeader>, "left" | "right"> {
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  actions,
  ...props
}) => {
  return (
    <SurfaceHeader
      {...props}
      left={
        breadcrumbs !== undefined ? (
          <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        ) : undefined
      }
      right={actions}
    />
  );
};
