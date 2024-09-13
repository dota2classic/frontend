export const blinkTab = (
  baseName: string,
  blinkName: string,
  inter: number = 1000,
) => {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= 10) {
      clearInterval(interval);
      document.title = blinkName;
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
