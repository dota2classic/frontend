"use client";
import React from "react";
import { fromNow } from "@/util/time";

interface ITimeAgoProps {
  date: number | Date | string;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date }) => {
  return <>{fromNow(date instanceof Date ? new Date(date) : date)}</>;
};
