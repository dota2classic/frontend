import { ProfileDecorationDto } from "@/api/back";
import c from "./EditProfileDecorations.module.scss";
import React, { ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GenericTooltip } from "@/components";

interface Props {
  decorations: ProfileDecorationDto[];
  current?: ProfileDecorationDto;
  onSelect: (decoration?: number) => void;
  title: ReactNode;
}
export const SelectImageDecoration = ({
  decorations,
  current,
  title,
  onSelect,
}: Props) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      {isSelectOpen &&
        tooltipRef.current &&
        createPortal(
          <GenericTooltip
            friends={[tooltipRef]}
            anchor={tooltipRef.current!}
            onClose={() => setIsSelectOpen(false)}
            interactable
          >
            <div className={c.imageGallery}>
              <img
                onClick={() => {
                  setIsSelectOpen(false);
                  onSelect(undefined);
                }}
                src={"/avatar.png"}
                alt=""
              />

              {decorations.map((decoration) => (
                <img
                  onClick={() => {
                    setIsSelectOpen(false);
                    onSelect(decoration.id);
                  }}
                  key={decoration.id}
                  src={decoration.image.url}
                  alt=""
                />
              ))}
            </div>
          </GenericTooltip>,
          document.body,
        )}

      <div
        ref={tooltipRef}
        className={c.imageDecoration}
        onClick={() => setIsSelectOpen(true)}
      >
        <img src={current?.image?.url || "/avatar.png"} alt="" />
        <header>{title}</header>
      </div>
    </>
  );
};
