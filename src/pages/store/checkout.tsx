import { ReceiveSubscriptionModal } from "@/containers";
import { AppRouter } from "@/route";

export default function CheckoutPage() {
  return (
    <>
      <ReceiveSubscriptionModal
        title="Подписка приобретена!"
        onAcknowledge={() => undefined}
        item={{
          image: "/maskot/present.png",
          name: "dotaclassic plus",
        }}
        action={{
          link: AppRouter.players.player.settings("116514945").link,
          label: "Настроить профиль",
        }}
      />
    </>
  );
}
