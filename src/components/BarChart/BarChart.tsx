import React from "react";

import c from "./BarChart.module.scss";

interface DataSegment {
  color: string;
  value: number;
}

interface IBarChartProps {
  data: DataSegment[];
}

interface KDABarChart {
  kills: number;
  deaths: number;
  assists: number;
}

interface SingleWeightedKDABarChart {
  value: number;
  color: string;
}

export const BarChart: React.FC<IBarChartProps> = ({ data }) => {
  const totalWidth = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className={c.bar}>
      {data.map((it, index) => (
        <span
          key={it.color}
          className={c.segment}
          style={{
            backgroundColor: it.color,
            width: `${(it.value / totalWidth) * 100}%`,
          }}
        ></span>
      ))}
    </div>
  );
};

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
