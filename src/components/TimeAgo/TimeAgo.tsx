"use client";
import React from "react";
import { fullDate, prettyDate } from "@/util/dates";
import { useTranslation } from "react-i18next";

interface ITimeAgoProps {
  date: number | Date | string;
  pretty?: boolean;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date, pretty }) => {
  const { i18n } = useTranslation();
  if (pretty) {
    return <>{prettyDate(new Date(date), i18n.language)}</>;
  }
  return <>{fullDate(new Date(date))}</>;
};
