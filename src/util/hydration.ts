// export const deleteUndefined = (obj: Record<string, any> | undefined): void => {
//   if (obj) {
//     Object.keys(obj).forEach((key: string) => {
//       if (obj[key] && typeof obj[key] === "object") {
//         deleteUndefined(obj[key]);
//       } else if (typeof obj[key] === "undefined") {
//         delete obj[key]; // eslint-disable-line no-param-reassign
//       }
//     });
//   }
// };
//
// export function useSSProps<T>(
//   getStaticProps: (ctx: GetServerSidePropsContext) => Promise<T>,
// ): (ctx: GetServerSidePropsContext) => Promise<T> {
//   return async (ctx: GetServerSidePropsContext) => {
//     const r = await getStaticProps(ctx);
//     deleteUndefined(r);
//     return r;
//   };
// }
