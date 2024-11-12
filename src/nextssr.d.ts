import { NextPageContext } from "next";
import { RootStore } from "@/store";
import { AppApi } from "@/api/hooks";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  interface CallableFunction extends Function {
    getInitialProps?: (ctx: NextPageContext) => Promise<unknown>;
  }

  interface Window {
    store: RootStore;
    api: AppApi;
  }

  interface PromiseConstructor {
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
