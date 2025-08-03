import { getApi } from "@/api/hooks";
import { DropSettingsDto, DropTierDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { EditDropSettings } from "@/containers";
import { NextPageContext } from "next";

interface Props {
  tiers: DropTierDto[];
  settings: DropSettingsDto;
}

export default function DropSettingsPage({ tiers, settings }: Props) {
  return <EditDropSettings tiers={tiers} settings={settings} />;
}

DropSettingsPage.getInitialProps = async (ctx: NextPageContext) => {
  const [tiers, settings] = await withTemporaryToken(ctx, () =>
    Promise.combine([
      getApi().drops.itemDropControllerGetDropTiers(),
      getApi().drops.itemDropControllerGetSettings(),
    ]),
  );

  return {
    tiers,
    settings,
  };
};
