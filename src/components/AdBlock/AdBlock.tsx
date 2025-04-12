import React, { useEffect } from "react";

import c from "./AdBlock.module.scss";

interface Props {
  bannerId: string;
}

export const AdBlock: React.FC<Props> = ({ bannerId }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      window.yaContextCb.push(() => {
        window.Ya.Context.AdvManager.render({
          blockId: `${bannerId}`,
          renderTo: `yandex_rtb_${bannerId}`,
        });
      });
    }, 500);
  }, []);

  return (
    <div className={c.adBlock}>
      <div id={`yandex_rtb_${bannerId}`} />
    </div>
  );
};
