"use client";
import React from "react";
import { fullDate } from "@/util/dates";

interface ITimeAgoProps {
  date: number | Date | string;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date }) => {
  return <>{fullDate(new Date(date))}</>;
};
