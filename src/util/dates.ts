function convertTZ(date: Date | string, tzString: Intl.LocalesArgument) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString as string,
    }),
  );
}

export const toMoscowTime = (timestamp: string) => {
  return convertTZ(timestamp, "Europe/Moscow");
};

const format = new Intl.DateTimeFormat("ru-RU", {});

export function formatShortTime(d: Date): string {
  const now = new Date();
  const diffDays = now.getDate() - d.getDate();
  const diffMonths = now.getMonth() - d.getMonth();
  const diffYears = now.getFullYear() - d.getFullYear();
  const timeString = d.toTimeString().split(":").slice(0, 2).join(":");

  if (diffDays === 0 && diffMonths === 0 && diffYears === 0) {
    return `Сегодня в ${timeString}`;
  } else if (diffYears === 0 && diffDays === 1) {
    return `Вчера в ${timeString}`;
  } else {
    return format.format(d) + ", " + timeString;
  }
}
