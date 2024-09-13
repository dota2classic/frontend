import React from "react";

import { SearchGameButton } from "..";

import c from "./SearchGameFloater.module.scss";

interface ISearchGameFloaterProps {}

export const SearchGameFloater: React.FC<ISearchGameFloaterProps> = ({}) => {
  return (
    <div className={c.container}>
      <SearchGameButton />
    </div>
  );
};
