import React from "react";

import { AcceptGameModal, SearchGameButton } from "..";

import c from "./SearchGameFloater.module.scss";

interface ISearchGameFloaterProps {}

export const SearchGameFloater: React.FC<ISearchGameFloaterProps> = ({}) => {
  return (
    <div className={c.container}>
      <AcceptGameModal />
      <SearchGameButton />
    </div>
  );
};
