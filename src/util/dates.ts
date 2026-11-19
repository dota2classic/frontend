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

export function prettyDate(
  date: Date,
  locale: string = navigator.language,
): string {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(date);

  const dateTime = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${weekday}, ${dateTime}`;
}

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {}).format(d);
}

import { useTranslation } from "react-i18next";
import { useSyncExternalStore } from "react";

const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function useFormattedDuration() {
  const { t } = useTranslation();

  return (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);

    const weeks = Math.floor(totalSeconds / (7 * 24 * 3600));
    const days = Math.floor((totalSeconds % (7 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];

    if (weeks) parts.push(t("dates.format_short.w", { count: weeks }));
    if (days) parts.push(t("dates.format_short.d", { count: days }));
    if (hours) parts.push(t("dates.format_short.h", { count: hours }));
    if (minutes) parts.push(t("dates.format_short.m", { count: minutes }));

    return parts.slice(0, 3).join(", ");
  };
}

export function useLongFormattedDuration() {
  const { t } = useTranslation();

  return (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);

    // const weeks = Math.floor(totalSeconds / (7 * 24 * 3600));
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts: string[] = [];

    // if (weeks) parts.push(t("dates.format_long.weeks", { count: weeks }));
    if (days) parts.push(t("dates.format_long.days", { count: days }));
    if (hours) parts.push(t("dates.format_long.hours", { count: hours }));
    if (minutes) parts.push(t("dates.format_long.minutes", { count: minutes }));

    return parts.slice(0, 3).join(", ");
  };
}

export function useFormattedDateTime() {
  const { t, i18n } = useTranslation();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    clientHydrated,
    serverHydrated,
  );

  return (date: Date) => {
    const now = new Date();
    // The server and initial hydration must use the same zone. Switch to the
    // user's local zone after hydration, including relative-day comparisons.
    const timeZone = hydrated ? undefined : "UTC";
    const dayFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const today = new Date(now);
    const yesterday = new Date(today);
    if (hydrated) yesterday.setDate(today.getDate() - 1);
    else yesterday.setUTCDate(today.getUTCDate() - 1);
    const dateOnly = dayFormatter.format(date);

    const timeFormatter = new Intl.DateTimeFormat(i18n.language, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });

    if (dateOnly === dayFormatter.format(today)) {
      return t("dates.todayAt", { time: timeFormatter.format(date) });
    }
    if (dateOnly === dayFormatter.format(yesterday)) {
      return t("dates.yesterdayAt", { time: timeFormatter.format(date) });
    }

    const fullFormatter = new Intl.DateTimeFormat(i18n.language, {
      timeZone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return fullFormatter.format(date);
  };
}

export const diffMillis = (
  date1: Date | string | number,
  date2: Date | string | number,
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d2.getTime() - d1.getTime();
};

export function createDateComparator<T>(
  getDate: (e: T) => Date,
  desc: boolean = false,
) {
  return (a: T, b: T) =>
    (getDate(a).getTime() - getDate(b).getTime()) * (desc ? -1 : 1);
}
