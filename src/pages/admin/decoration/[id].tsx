import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { ProfileDecorationDto } from "@/api/back";
import { EditHatContainer } from "@/containers/EditHatContainer";

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
  const id = Number(ctx.query.id as string);
  const decoration = await withTemporaryToken(ctx, () =>
    getApi().decoration.customizationControllerGetDecoration(id),
  );
  return {
    decoration,
  };
};
