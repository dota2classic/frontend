import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { ProfileDecorationDto, UserProfileDecorationType } from "@/api/back";
import { BigTabs, Button, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import { TabItem } from "@/components/BigTabs/BigTabs";
import { enumValues } from "@/util/enumValues";
import c from "./Decorations.module.scss";
import cx from "clsx";

interface Props {
  decorations: ProfileDecorationDto[];
  type: UserProfileDecorationType;
}

const tabs: TabItem<UserProfileDecorationType>[] =
  enumValues<UserProfileDecorationType>(UserProfileDecorationType).map(
    (type) => ({
      label: type,
      key: type,
      onSelect: AppRouter.admin.decoration.list(type).link,
    }),
  );

export default function DecorationList({ decorations, type }: Props) {
  return (
    <>
      <BigTabs<UserProfileDecorationType>
        flavor={"small"}
        items={tabs}
        selected={type}
      />
      <Button onClick={() => AppRouter.admin.decoration.create(type).open()}>
        Создать новую декорацию: {type}
      </Button>
      <div
        className={cx(
          c.decorations,
          type !== UserProfileDecorationType.HAT && c.small,
        )}
      >
        {decorations.map((decoration) => (
          <Panel key={decoration.id} className={c.decorationCard}>
            <PageLink
              className="link"
              link={AppRouter.admin.decoration.edit(decoration.id).link}
            >
              <header>{decoration.title}</header>
            </PageLink>
            <img src={decoration.image.url} alt="" />
          </Panel>
        ))}
      </div>
    </>
  );
}

DecorationList.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const type =
    (ctx.query.type as string as UserProfileDecorationType) ||
    UserProfileDecorationType.HAT;
  const [decorations] = await withTemporaryToken(ctx, () =>
    Promise.combine([getApi().decoration.customizationControllerAll(type)]),
  );

  return {
    decorations,
    type,
  };
};
