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
import { Input } from "@/components";
import { useStore } from "@/store";
import { useKeyDown } from "@/util/keyboard";

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

export const EmoticonSelectWindow: React.FC<IEmoticonSelectWindowProps> =
  observer(({ onClose, anchor, onSelect }) => {
    const [searchValue, setSearchValue] = useState("");
    const { emoticons } = useStore().threads;

    const isShiftDown = useKeyDown("Shift");

    const [hoveredEmoticon, setHoveredEmoticon] = useState<EmoticonDto>({
      code: "cocky",
      id: 29,
      src: "https://s3.dotaclassic.ru/emoticons/cocky.gif",
    });

    const containerRef = useRef<HTMLDivElement | null>(null);
    useOutsideClick(onClose, containerRef, [anchor]);

    const emos = useMemo(() => {
      return emoticons.filter((emo) =>
        emo.code.includes(searchValue.replaceAll(":", "")),
      );
    }, [emoticons, searchValue]);

    const onReact = useCallback((emo: EmoticonDto) => {
      onSelect(emo);
      if (!isShiftDown) {
        onClose();
      }
    }, []);

    const position = useMemo<Position>(() => {
      console.log(
        "Calculating position: anchor=",
        anchor.current,
        "container=",
        containerRef.current,
      );
      if (
        !anchor.current ||
        !containerRef.current ||
        typeof window === "undefined"
      )
        return {};

      const rect = anchor.current!.getBoundingClientRect();

      const windowHeight = containerRef.current!.clientHeight;
      const windowWidth = containerRef.current!.clientWidth;

      const scrollY = window.scrollY;

      const wb = window.innerHeight;

      const top = Math.min(scrollY + (wb - windowHeight - 12), rect.top - 3);

      console.log(
        containerRef.current?.clientWidth,
        containerRef.current?.clientHeight,
        rect,
      );

      let left = rect.left - windowWidth;
      if (left < 0) {
        // no-no
        left = 12;
      }

      return {
        left,
        top,
      };
    }, [containerRef.current, anchor.current]);

    return (
      <div
        className={cx(c.emoticons, c.emoticons__visible)}
        style={position}
        ref={containerRef}
      >
        <Input
          placeholder={`:${hoveredEmoticon.code}:`}
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
          <span>:{hoveredEmoticon.code}:</span>
        </div>
      </div>
    );
  });
