import React, { useEffect, useState } from "react";

import c from "./AdBlock.module.scss";

interface Props {
  bannerId: string;
}

export const AdBlock: React.FC<Props> = ({ bannerId }: Props) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setReady(true), 500);
  }, []);

  return (
    <div className={c.adBlock}>
      <div id={`yandex_rtb_${bannerId}`}></div>
      {ready && (
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
      )}{" "}
    </div>
  );
};
