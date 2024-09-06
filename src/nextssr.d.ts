import {NextPageContext} from "next";

declare global {
  interface CallableFunction extends Function {
    getInitialProps?: (ctx: NextPageContext) => Promise<any>;
  }
}
