import { EditRulesContainer } from "@/containers";
import { getApi } from "@/api/hooks";
import { RuleDto } from "@/api/back";

interface Props {
  rules: RuleDto[];
}
export default function EditRules({ rules }: Props) {
  return (
    <>
      <br />
      <EditRulesContainer rules={rules} />
    </>
  );
}

EditRules.getInitialProps = async () => {
  return {
    rules: await getApi().rules.ruleControllerGetAllRules(),
  };
};
