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

export function fullDate(d: Date): string {
  const timeString = d.toTimeString().split(":").slice(0, 2).join(":");
  return format.format(d) + ", " + timeString;
}

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
    return fullDate(d);
  }
}

export const diffMillis = (
  date1: Date | string | number,
  date2: Date | string | number,
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d2.getTime() - d1.getTime();
};
