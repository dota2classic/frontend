export const blinkTab = (
  baseName: string,
  blinkName: string,
  inter: number = 1000,
  iterations: number = 10,
) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= iterations) {
      clearInterval(interval);
      document.title = baseName;
      return;
    }
    if (i % 2 === 0) {
      document.title = blinkName;
    } else {
      document.title = baseName;
    }
    i++;
  }, inter);
};
