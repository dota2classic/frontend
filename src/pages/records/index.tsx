import { PlayerRecordsResponse } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerRecords } from "@/containers/PlayerRecords";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface Props {
  records: PlayerRecordsResponse;
}

export default function RecordsPage({ records }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("records_page.seo.title")}
        description={t("records_page.seo.description")}
      />
      <PlayerRecords records={records} />
    </>
  );
}

RecordsPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const api = getRequestApi(ctx);
  return {
    records: await api.record.recordControllerRecords(),
  };
};
