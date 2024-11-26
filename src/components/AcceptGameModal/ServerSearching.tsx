import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { observer } from "mobx-react-lite";
import cx from "clsx";

interface Props {
  className?: string;
}
export const ServerSearching = observer((p: Props) => {
  return (
    <div className={cx(p.className)}>
      <div className={c.header}>
        {/*<h3>{formatGameMode(queue.gameInfo!.mode)}</h3>*/}
        <h4 style={{ marginTop: 12 }}>Идет поиск сервера...</h4>
      </div>
    </div>
  );
});
