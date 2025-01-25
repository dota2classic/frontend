import c from "@/pages/items/Items.module.scss";
import { useMemo } from "react";

export default function ItemsWiki() {
  const originalUrl = useMemo(() => {
    return `https://wiki.dotaclassic.ru/items/1`;
  }, []);
  return (
    <>
      <iframe className={c.itemsPage} src={originalUrl} />
    </>
  );
}
