import React from "react";
import { BarChart } from "./BarChart";

interface SingleWeightedKDABarChart {
  value: number;
  color: string;
}

export const SingleWeightedBarChart: React.FC<SingleWeightedKDABarChart> = ({
  value,
  color,
}) => {
  return (
    <BarChart
      data={[
        { color: color, value: value },
        { color: "rgba(0,0,0,0)", value: 1 - value },
      ]}
    />
  );
};
