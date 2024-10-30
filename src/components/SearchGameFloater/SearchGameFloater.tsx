import React from "react";

import { AcceptGameModal, SearchGameButton } from "..";

import c from "./SearchGameFloater.module.scss";

export const SearchGameFloater: React.FC = () => {
  return (
    <div className={c.container}>
      <AcceptGameModal />
      <SearchGameButton />
    </div>
  );
};
