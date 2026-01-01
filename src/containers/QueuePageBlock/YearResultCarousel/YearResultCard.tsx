import c from "./YearResultCarousel.module.scss";
import { NumberFormat } from "@/components/NumberFormat";
import React, { ReactNode } from "react";

interface Props {
  image: string;
  title: ReactNode;
  recordValue: number;
  comment: ReactNode;
}
export const YearResultCard = ({
  image,
  title,
  recordValue,
  comment,
}: Props) => {
  return (
    <div className={c.card}>
      <img className={c.image} alt={""} src={image} width={500} height={500} />
      <div className={c.shadow} />
      <div className={c.contentContainer}>
        <span className={c.recordType}>{title}</span>
        <div className={c.recordValue}>
          <NumberFormat comma number={recordValue} />
        </div>
        <span className={c.recordTime}>{comment}</span>
      </div>
    </div>
  );
};
