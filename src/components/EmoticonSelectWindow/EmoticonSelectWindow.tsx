import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import c from "./EmoticonSelectWindow.module.scss";
import { observer } from "mobx-react-lite";
import { EmoticonDto } from "@/api/back";
import cx from "clsx";
import useOutsideClick from "@/util/useOutsideClick";
import { Input } from "../Input";
import { useStore } from "@/store";
import { useKeyDown } from "@/util/keyboard";
import { GreedyFocusPriority, useGreedyFocus } from "@/util/useTypingCallback";
import { useTranslation } from "react-i18next";

interface IEmoticonSelectWindowProps {
  onClose: () => void;
  anchor: RefObject<HTMLElement | null>;
  onSelect: (emo: EmoticonDto) => void;
}

interface Position {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

const calculateModalPosition = (
  anchor: HTMLElement | null,
  modal: HTMLElement | null,
): Position => {
  if (!anchor || !modal || typeof window === "undefined") return {};

  const rect = anchor.getBoundingClientRect();

  const windowHeight = modal.clientHeight;
  const windowWidth = modal.clientWidth;

  const scrollY = window.scrollY;

  const wb = window.innerHeight;

  const top = Math.min(scrollY + (wb - windowHeight - 12), rect.top - 3);

  let left = rect.left - windowWidth;
  if (left < 0) {
    // no-no
    left = 12;
  }

  return {
    left,
    top,
  };
};

export const EmoticonSelectWindow: React.FC<IEmoticonSelectWindowProps> =
  observer(({ onClose, anchor, onSelect }) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const { emoticons } = useStore().threads;

    const isShiftDown = useKeyDown("Shift");

    const [hoveredEmoticon, setHoveredEmoticon] = useState<EmoticonDto>({
      code: "cocky",
      id: 29,
      src: "https://s3.dotaclassic.ru/emoticons/cocky.gif",
    });

    const inputRef = useRef<HTMLInputElement | null>(null);
    useGreedyFocus(GreedyFocusPriority.EMOTICON_WINDOW_SEARCH, inputRef);

    const containerRef = useRef<HTMLDivElement | null>(null);
    useOutsideClick(onClose, containerRef, [anchor]);

    const emos = useMemo(() => {
      return emoticons.filter((emo) =>
        emo.code.includes(searchValue.replaceAll(":", "")),
      );
    }, [emoticons, searchValue]);

    const onReact = useCallback(
      (emo: EmoticonDto) => {
        onSelect(emo);
        if (!isShiftDown) {
          onClose();
        }
      },
      [isShiftDown, onClose, onSelect],
    );

    return (
      <div
        className={cx(c.emoticons, c.emoticons__visible)}
        ref={(e) => {
          if (!e) return;
          if (!containerRef.current) {
            const position = calculateModalPosition(anchor.current, e);
            e.style.left = position.left + "px";
            e.style.top = position.top + "px";
          }

          containerRef.current = e;
        }}
      >
        <Input
          ref={inputRef}
          placeholder={t("emoticon_select_window.placeholder", {
            code: hoveredEmoticon.code,
          })}
          className={c.search}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={c.listEmoticons}>
          {emos.map((emo) => (
            <img
              onMouseEnter={() => setHoveredEmoticon(emo)}
              key={emo.id}
              src={emo.src}
              alt=""
              onClick={() => onReact(emo)}
            />
          ))}
        </div>
        <div className={c.reactionPreview}>
          <img src={hoveredEmoticon.src} alt="" />
          <span>
            {t("emoticon_select_window.hoveredEmoticon", {
              code: hoveredEmoticon.code,
            })}
          </span>
        </div>
      </div>
    );
  });
