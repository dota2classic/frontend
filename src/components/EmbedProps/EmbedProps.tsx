import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

interface IEmbedPropsProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export const EmbedProps: React.FC<IEmbedPropsProps> = (p) => {
  const url = useRouter().asPath;
  const title = `DOTA2CLASSIC - ${p.title}`;
  return (
    <Head>
      <meta property="og:title" content={title} />
      <title>{title}</title>
      <meta property="og:description" content={p.description} />
      <meta property="og:image" content={p.image} />
      <meta property="summary_large_image" content={p.image} />
      <meta property="og:url" content={p.url || url} />
    </Head>
  );
};
