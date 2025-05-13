import c from "@/containers/EditProfileDecorations/EditProfileDecorations.module.scss";
import React, { ReactNode } from "react";
import { ProfileDecorationDto } from "@/api/back";
import { SelectOptions } from "@/components";

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
  const options = [
    { label: "По умолчанию", value: undefined },
    ...decorations.map((it) => ({ label: it.title, value: it.id })),
  ];
  return (
    <div className={c.imageDecoration}>
      <SelectOptions
        options={options}
        selected={current?.id}
        onSelect={(value) => onSelect(value.value)}
        defaultText={"dotaclassic plus"}
      />
      <header>{title}</header>
    </div>
  );
};
