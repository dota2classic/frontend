import React from "react";

import c from "./AdBlock.module.scss";

interface Props {
  bannerId: string;
}

export const AdBlock: React.FC<Props> = ({ bannerId }: Props) => {
  return (
    <div className={c.adBlock}>
      <div id={`yandex_rtb_${bannerId}`}></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
          "blockId": "${bannerId}",
          "renderTo": "yandex_rtb_${bannerId}"
        })
      })
      `,
        }}
      />
    </div>
  );
};
