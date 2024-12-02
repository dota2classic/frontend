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
