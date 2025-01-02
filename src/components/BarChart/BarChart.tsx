import React from "react";

import c from "./BarChart.module.scss";

interface DataSegment {
  color: string;
  value: number;
}

interface IBarChartProps {
  data: DataSegment[];
}

export const BarChart: React.FC<IBarChartProps> = ({ data }) => {
  const totalWidth = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className={c.bar}>
      {data.map((it) => (
        <span
          key={it.color}
          className={c.segment}
          style={{
            backgroundColor: it.color,
            width: `${(it.value / totalWidth) * 100}%`,
          }}
        />
      ))}
    </div>
  );
};
