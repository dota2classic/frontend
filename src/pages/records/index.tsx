import { PlayerRecordsResponse } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components";
import { PlayerRecords } from "@/containers";

interface Props {
  records: PlayerRecordsResponse;
}

export default function RecordsPage({ records }: Props) {
  return (
    <>
      <EmbedProps
        title={"Рекорды"}
        description={
          "Рекорды, поставленные игроками на сайте dotaclassic.ru на старом патче 6.84c"
        }
      />
      <h1>Рекорды игроков</h1>
      <PlayerRecords records={records} />
    </>
  );
}

RecordsPage.getInitialProps = async (): Promise<Props> => {
  return {
    records: await getApi().record.recordControllerRecords(),
  };
};
