import { NextPageContext } from "next";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  interface CallableFunction extends Function {
    getInitialProps?: (ctx: NextPageContext) => Promise<unknown>;
  }
}
