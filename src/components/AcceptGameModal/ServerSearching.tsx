import c from "@/components/AcceptGameModal/AcceptGameModal.module.scss";
import { observer } from "mobx-react-lite";
import cx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
}
export const ServerSearching = observer((p: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cx(p.className)}>
      <div className={c.header}>
        <h4 style={{ marginTop: 12 }}>{t("server_searching.searching")}</h4>
      </div>
    </div>
  );
});
