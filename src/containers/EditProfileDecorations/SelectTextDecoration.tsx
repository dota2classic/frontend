import c from "@/containers/EditProfileDecorations/EditProfileDecorations.module.scss";
import React, { ReactNode } from "react";
import { ProfileDecorationDto } from "@/api/back";
import { SelectOptions } from "@/components/SelectOptions";
import { useTranslation } from "react-i18next";

interface Props {
  decorations: ProfileDecorationDto[];
  current?: ProfileDecorationDto;
  onSelect: (decoration?: number) => void;
  title: ReactNode;
}
export const SelectTextDecoration = ({
  decorations,
  current,
  title,
  onSelect,
}: Props) => {
  const { t } = useTranslation();
  const options = [
    { label: t("edit_profile.default"), value: undefined },
    ...decorations.map((it) => ({ label: it.title, value: it.id })),
  ];
  return (
    <div className={c.imageDecoration}>
      <SelectOptions
        options={options}
        selected={current?.id}
        onSelect={(value) => onSelect(value.value)}
        defaultText={t("edit_profile.dotaclassicPlus")}
      />
      <header>{title}</header>
    </div>
  );
};
