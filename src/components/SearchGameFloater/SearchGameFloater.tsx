import React from "react";

import { AcceptGameModal } from "../AcceptGameModal";

import c from "./SearchGameFloater.module.scss";
import { observer } from "mobx-react-lite";

export const SearchGameFloater: React.FC = observer(() => {
  return (
    <div className={c.container}>
      <AcceptGameModal />
    </div>
  );
});
