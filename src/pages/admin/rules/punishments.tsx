import { getApi } from "@/api/hooks";
import { RulePunishmentDto } from "@/api/back";
import { AdminRuleTabs, EditPunishmentsContainer } from "@/containers";
import { EmbedProps } from "@/components";

interface Props {
  punishments: RulePunishmentDto[];
}

export default function EditPunishmentsPage({ punishments }: Props) {
  return (
    <>
      <EmbedProps title={"Редактирование наказаний"} description={""} />
      <AdminRuleTabs />
      <EditPunishmentsContainer punishments={punishments} />
    </>
  );
}

EditPunishmentsPage.getInitialProps = async (): Promise<Props> => {
  return {
    punishments: await getApi().rules.ruleControllerGetAllPunishments(),
  };
};
