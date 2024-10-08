"use client";
import React from "react";

export const formatDateStr = (
  value: string | number,
  locale?: string,
): string => {
  return new Date(value).toLocaleString(locale || "ru-RU", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    hour12: false,
  });
};

interface ITimeAgoProps {
  date: number | Date | string;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date }) => {
  // return <>{fromNow(date instanceof Date ? new Date(date) : date)}</>;
  return <>{formatDateStr(date as any)}</>;
};
