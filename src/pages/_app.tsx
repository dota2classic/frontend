import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components";

import localFont from "next/font/local";

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: "./TrajanPro3Regular.ttf" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout className={myFont.className}>
      <Component {...pageProps} />
    </Layout>
  );
}
