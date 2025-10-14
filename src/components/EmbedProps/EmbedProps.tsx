import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface IEmbedPropsProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}

const domains = [
  {
    lang: "ru",
    domain: "",
  },
  {
    lang: "en",
    domain: "en.",
  },
];

export const EmbedProps: React.FC<PropsWithChildren<IEmbedPropsProps>> = (
  p,
) => {
  const isDev = process.env.IS_DEV_VERSION;
  const url = useRouter().asPath;
  const title = `${p.title} • dotaclassic.ru`;
  return (
    <Head>
      <meta property="og:title" content={title} />
      <title>{title}</title>
      <meta name="description" content={p.description} />
      <meta property="og:description" content={p.description} />
      <meta property="og:image" content={p.image} />
      <meta property="summary_large_image" content={p.image} />
      <meta property="og:url" content={p.url || url} />
      {domains.map((domain) => (
        <link
          key={domain.lang}
          rel="alternate"
          hrefLang={domain.lang}
          href={`https://${domain.domain}dotaclassic.ru${url}`}
        />
      ))}
      {(p.noindex || isDev) && (
        <>
          <meta name="robots" content="noindex,nofollow" />
          <meta name="googlebot" content="noindex,nofollow" />
        </>
      )}
      {p.children}
    </Head>
  );
};
