import { NextPageContext } from "next";

declare global {
  interface CallableFunction extends Function {
    getInitialProps?: (ctx: NextPageContext) => Promise<any>;
    getServerSideProps?: (ctx: NextPageContext) => Promise<any>;
  }
}
