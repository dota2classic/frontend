import React from "react";

import { EmbedProps } from "..";
import { useTranslation } from "react-i18next";

export const NewLanding = () => {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("new_landing.playOldDota")}
        description={t("new_landing.dota2ClassicDescription")}
      >
        <link rel="canonical" href="https://dotaclassic.ru" />
      </EmbedProps>
    </>
  );
};
