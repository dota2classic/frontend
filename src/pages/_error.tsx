import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";
import { NextPageContext } from "next";
import Error from "next/error";
import { useEffect } from "react";

interface Props {
  statusCode: number;
  errorMessage?: string;
}

export default function Error500({ statusCode, errorMessage }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!errorMessage) return;
    import("@/util/faro").then(({ logError }) =>
      logError(new Error(errorMessage as unknown as never), {
        statusCode: String(statusCode),
      }),
    );
  }, [errorMessage, statusCode]);

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
  const errorProps = await Error.getInitialProps(contextData);

  if (contextData.err) {
    await sendSsrErrorToLoki(contextData.err as unknown as never).catch(
      () => {},
    );
  }

  return {
    ...errorProps,
    errorMessage: contextData.err?.message,
  };
};

async function sendSsrErrorToLoki(err: { message?: string; stack?: string }) {
  const url = "http://141.105.71.200:3100/loki/api/v1/push";
  const now = (Date.now() * 1_000_000).toString();
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      streams: [
        {
          stream: {
            source: "faro",
            env: "prod",
            app: "d2c-new",
            level: "error",
          },
          values: [[now, `SSR error: ${err.message}\n${err.stack ?? ""}`]],
        },
      ],
    }),
  });
}
