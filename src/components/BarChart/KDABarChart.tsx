import React from "react";
import { BarChart } from "@/components";

interface KDABarChart {
  kills: number;
  deaths: number;
  assists: number;
}

export const KDABarChart: React.FC<KDABarChart> = ({
  kills,
  deaths,
  assists,
}) => {
  return (
    <BarChart
      data={[
        { color: "#c23c2a", value: kills },
        { color: "#979797", value: deaths },
        { color: "#92a525", value: assists },
      ]}
    />
  );
};
