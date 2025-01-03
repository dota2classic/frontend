const nf = new Intl.NumberFormat("ru-RU", { signDisplay: "exceptZero" });
export const signedNumber = (n: number) => nf.format(n);
