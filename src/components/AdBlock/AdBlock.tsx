import React from "react";

import c from "./AdBlock.module.scss";

export const AdBlock: React.FC = () => {
  // <!-- Yandex.RTB R-A-14918139-1 -->
  return (
    <div className={c.adBlock}>
      <div id="yandex_rtb_R-A-14918139-1"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
          "blockId": "R-A-14918139-1",
          "renderTo": "yandex_rtb_R-A-14918139-1"
        })
      })
      `,
        }}
      />
    </div>
  );
};
