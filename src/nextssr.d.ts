/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-empty-object-type */
import { NextPageContext } from "next";
import { RootStore } from "@/store";
import { AppApi } from "@/api/hooks";
import Cookies from "js-cookie";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  interface CallableFunction extends Function {
    getInitialProps?: (ctx: NextPageContext) => Promise<unknown>;
  }

  interface Window {
    env: string;
    process: Record<string, string>;
    store: RootStore;
    bracketsViewer: any;
    registration?: ServiceWorkerRegistration;
    api: AppApi;
    cook: Cookies;
    ym: (key: number, fun: string, value: unknown) => void;
    yaContextCb: any;
    Ya: any;
  }

  interface PromiseConstructor {
    combine<A>(promises: [Promise<A>]): Promise<[A]>;
    combine<A, B>(promises: [Promise<A>, Promise<B>]): Promise<[A, B]>;
    combine<A, B, C>(
      promises: [Promise<A>, Promise<B>, Promise<C>],
    ): Promise<[A, B, C]>;
    combine<A, B, C, D>(
      promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>],
    ): Promise<[A, B, C, D]>;
    combine<A, B, C, D, E>(
      promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>, Promise<E>],
    ): Promise<[A, B, C, D, E]>;
    combine<A, B, C, D, E, F>(
      promises: [
        Promise<A>,
        Promise<B>,
        Promise<C>,
        Promise<D>,
        Promise<E>,
        Promise<F>,
      ],
    ): Promise<[A, B, C, D, E, F]>;
    combine<A, B, C, D, E, F, G>(
      promises: [
        Promise<A>,
        Promise<B>,
        Promise<C>,
        Promise<D>,
        Promise<E>,
        Promise<F>,
        Promise<G>,
      ],
    ): Promise<[A, B, C, D, E, F, G]>;
  }
}
