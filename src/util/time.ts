const locale = "ru";

/**
 * Human readable elapsed or remaining time (example: 3 minutes ago)
 * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
 * @param  {Date|Number|String} [nowDate] A Date object, timestamp or string parsable with Date.parse()
 * @param  {Intl.RelativeTimeFormat} [rft] A Intl formater
 * @return {string} Human readable elapsed or remaining time
 * @author github.com/victornpb
 * @see https://stackoverflow.com/a/67338038/938822
 */

type RegularTimeDesc = { ge: number, divisor: number, unit:
  | "year"
  | "years"
  | "quarter"
  | "quarters"
  | "month"
  | "months"
  | "week"
  | "weeks"
  | "day"
  | "days"
  | "hour"
  | "hours"
  | "minute"
  | "minutes"
  | "second"
  | "seconds"; };
type ExtraTimeDesc = { ge: number, divisor: number, unit: undefined, text: string };

export function fromNow(
  date: Date | number | string,
  nowDate = new Date(),
  rft = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
) {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const YEAR = 365 * DAY;
  const MONTH = YEAR / 12;
  const intervals: (RegularTimeDesc | ExtraTimeDesc)[] = [
    { ge: YEAR, divisor: YEAR, unit: "year" },
    { ge: MONTH, divisor: MONTH, unit: "month" },
    { ge: WEEK, divisor: WEEK, unit: "week" },
    { ge: DAY, divisor: DAY, unit: "day" },
    { ge: HOUR, divisor: HOUR, unit: "hour" },
    { ge: MINUTE, divisor: MINUTE, unit: "minute" },
    { ge: 30 * SECOND, divisor: SECOND, unit: "seconds" },
    { ge: 0, divisor: 1, text: "только что", unit: undefined },
  ];
  const now =
    typeof nowDate === "object"
      ? nowDate.getTime()
      : new Date(nowDate).getTime();
  const diff =
    now - (typeof date === "object" ? date : new Date(date)).getTime();
  const diffAbs = Math.abs(diff);

  for (const interval of intervals) {
    if (diffAbs >= interval.ge) {
      const x = Math.round(Math.abs(diff) / interval.divisor);
      const isFuture = diff < 0;

      return interval.unit !== undefined
        ? rft.format(isFuture ? x : -x, interval.unit)
        : interval.text;
    }
  }
}

const nf = new Intl.NumberFormat("ru-RU", { signDisplay: "exceptZero" });

export const signedNumber = (n: number) => nf.format(n);
