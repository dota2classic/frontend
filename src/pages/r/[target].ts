import type { GetServerSideProps } from "next";

const DESTINATIONS = {
  a: "https://clicks.af-pb06e2.com/click?offer_id=802&partner_id=32902&landing_id=571&utm_medium=affiliate",
  b: "https://collectorsshop.ru/promo/old",
} as const;

type DestinationKey = keyof typeof DESTINATIONS;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const target = params?.target;
  const destination =
    typeof target === "string"
      ? DESTINATIONS[target as DestinationKey]
      : undefined;

  if (!destination) {
    return {
      notFound: true,
    };
  }

  res.writeHead(302, {
    Location: destination,
    "Cache-Control": "no-store",
  });
  res.end();

  return {
    props: {},
  };
};

export default function RoutePage() {
  return null;
}
