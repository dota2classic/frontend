import { Head, Html, Main, NextScript } from "next/document";
import { YandexMetrika, GoogleTagManager } from "@/components/YandexMetrika";
import { YaReklama } from "@/components/YaReklama";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href={`/normalize.css`} />
        <link rel="stylesheet" href={`/minimap.css`} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo/256.png" />
        <meta
          name="selfwork.ru"
          content="Cn4shOmjcDQKdnNyQ0JoiRgPLB2OmgzqFXoMSjhHK3NKQQ3KAV"
        />

        <YandexMetrika />
        <YaReklama />
        <GoogleTagManager />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
