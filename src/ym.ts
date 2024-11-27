export const metrika = (name: string, value: unknown) => {
  try {
    if (typeof window !== "undefined") {
      window.ym(98808071, name, value);
      console.log(`${name}(${value})`);
    }
  } catch (_e) {
    console.error(_e);
  }
};
