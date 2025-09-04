import { getApi } from "@/api/hooks";
import { RulePunishmentDto } from "@/api/back";
import { AdminRuleTabs } from "@/containers/AdminRuleTabs";
import { EditPunishmentsContainer } from "@/containers/EditPunishmentsContainer";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

interface Props {
  punishments: RulePunishmentDto[];
}

export default function EditPunishmentsPage({ punishments }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps title={t("edit_punishments.title")} description={""} />
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
