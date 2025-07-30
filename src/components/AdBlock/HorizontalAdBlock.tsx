import React from "react";

import c from "./AdBlock.module.scss";
import { GenericAdBlock } from "@/components/AdBlock/GenericAdBlock";

interface Props {
  bannerId: string;
}

export const HorizontalAdBlock: React.FC<Props> = ({ bannerId }: Props) => {
  return (
    <div className={c.horizontalAdBlock}>
      <GenericAdBlock bannerId={bannerId} />
    </div>
  );
};
