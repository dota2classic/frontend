"use client";
import React from "react";
import { fromNow } from "@/util/time";

interface ITimeAgoProps {
  date: number | Date;
}

export const TimeAgo: React.FC<ITimeAgoProps> = ({ date }) => {
  return <>{fromNow(typeof date === "number" ? new Date(date) : date)}</>;
};
