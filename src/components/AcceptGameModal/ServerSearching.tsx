import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { formatGameMode } from "@/util/gamemode";

interface Props {
  className?: string;
}
export const ServerSearching = observer((p: Props) => {
  const { queue } = useStore();
  return (
    <div className={cx(p.className)}>
      <div className={c.header}>
        <h3>{formatGameMode(queue.gameInfo!.mode)}</h3>
        <h4 style={{ marginTop: 12 }}>Идет поиск сервера...</h4>
      </div>
    </div>
  );
});
