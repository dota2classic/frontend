import React from "react";

import c from "./AdBlock.module.scss";
import { GenericAdBlock } from "./GenericAdBlock";

interface Props {
  bannerId: string;
}

export const SideAdBlock: React.FC<Props> = ({ bannerId }: Props) => {
  return (
    <div className={c.adBlock}>
      <GenericAdBlock bannerId={bannerId} />
    </div>
  );
};
