import { PlayerRecordsResponse } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components";
import { PlayerRecords } from "@/containers";
import { useTranslation } from "react-i18next";

interface Props {
  records: PlayerRecordsResponse;
}

export default function RecordsPage({ records }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("records_page.records")}
        description={t("records_page.recordsDescription")}
      />
      <h1>{t("records_page.playerRecords")}</h1>
      <PlayerRecords records={records} />
    </>
  );
}

RecordsPage.getInitialProps = async (): Promise<Props> => {
  return {
    records: await getApi().record.recordControllerRecords(),
  };
};
