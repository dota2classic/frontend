import { NextPageContext } from "next";
import { ProfileDecorationDto } from "@/api/back";
import { EditHatContainer } from "@/containers/EditHatContainer";
import { getRequestApi } from "@/api/request-api";

interface Props {
  decoration: ProfileDecorationDto;
}
export default function EditDecoration({ decoration }: Props) {
  return (
    <EditHatContainer
      decoration={decoration}
      decorationType={decoration.type}
    />
  );
}

EditDecoration.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const api = getRequestApi(ctx);
  const id = Number(ctx.query.id as string);
  const decoration =
    await api.decoration.customizationControllerGetDecoration(id);
  return {
    decoration,
  };
};
