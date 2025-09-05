import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";
import { NextPageContext } from "next";
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

export default function Error500({ statusCode }: { statusCode: number }) {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("error_page.pageLoadFailed", { statusCode })}</h1>
      <PageLink link={AppRouter.index.link}>
        <h3 className="green">{t("error_page.returnHome")}</h3>
      </PageLink>
    </>
  );
}
Error500.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};
