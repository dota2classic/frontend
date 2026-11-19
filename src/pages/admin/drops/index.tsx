import { DropSettingsDto, DropTierDto } from "@/api/back";
import { EditDropSettings } from "@/containers/EditDropSettings";
import { NextPageContext } from "next";
import { getRequestApi } from "@/api/request-api";

interface Props {
  tiers: DropTierDto[];
  settings: DropSettingsDto;
}

export default function DropSettingsPage({ tiers, settings }: Props) {
  return <EditDropSettings tiers={tiers} settings={settings} />;
}

DropSettingsPage.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const [tiers, settings] = await Promise.combine([
    api.drops.itemDropControllerGetDropTiers(),
    api.drops.itemDropControllerGetSettings(),
  ]);

  return {
    tiers,
    settings,
  };
};
