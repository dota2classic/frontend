"use client";
import React from "react";
import { fullDate } from "@/util/dates";

export const formatDateStr = (
  value: string | number | Date,
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
  return <>{fullDate(new Date(date))}</>;
};
