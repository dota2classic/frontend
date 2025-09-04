import React from "react";
import heroName from "@/util/heroName";

interface IHeroNameProps {
  name: string;
}

export const HeroName: React.FC<IHeroNameProps> = ({ name }) => {
  return <>{heroName(name)}</>;
};
