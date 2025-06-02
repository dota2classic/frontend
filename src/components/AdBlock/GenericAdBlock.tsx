import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import React, { useEffect } from "react";
import cx from "clsx";
import c from "./AdBlock.module.scss";

interface Props {
  bannerId: string;
}
export const GenericAdBlock: React.FC<Props> = observer(({ bannerId }) => {
  const { auth } = useStore();

  useEffect(() => {
    setTimeout(() => {
      window.yaContextCb.push(() => {
        window.Ya.Context.AdvManager.render({
          blockId: `${bannerId}`,
          renderTo: `yandex_rtb_${bannerId}`,
        });
      });
    }, 500);
  }, [auth.isOld, bannerId]);

  if (auth.isOld) return null;

  return (
    <div id={`yandex_rtb_${bannerId}`} className={cx(auth.isOld && c.hidden)} />
  );
});
