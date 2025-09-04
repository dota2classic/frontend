import React from "react";

import c from "./Emoticon.module.scss";
import { observer } from "mobx-react-lite";
import { EmoticonDto } from "@/api/back";
import { useStore } from "@/store";
import { Tooltipable } from "../Tooltipable";

type Props = { code: string } | { id: number };

export const Emoticon: React.FC<Props> = React.memo(
  observer(function Emoticon(p) {
    const { threads } = useStore();
    let emo: EmoticonDto | undefined;
    if ("code" in p) {
      emo = threads.emoticons.find((t) => t.code === p.code);
    } else {
      emo = threads.emoticons.find((t) => t.id === p.id);
    }

    if (!emo) return null;
    return (
      <Tooltipable className={c.emoticon} tooltip={`:${emo.code}:`}>
        <img key={emo.id} src={emo.src} alt="" />
      </Tooltipable>
    );
  }),
);
