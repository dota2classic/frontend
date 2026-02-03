"use client";
import React from "react";
import { fullDate, prettyDate } from "@/util/dates";
import i18next from "i18next";

interface ITimeAgoProps {
  date: number | Date | string;
  pretty?: boolean;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date, pretty }) => {
  if (pretty) {
    return <>{prettyDate(new Date(date), i18next.language)}</>;
  }
  return <>{fullDate(new Date(date))}</>;
};
