import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useTypingCallback } from "@/util/useTypingCallback";

export const GreedyFocusManager: React.FC = observer(() => {
  const { greedyFocus } = useStore();

  useTypingCallback(() => {
    greedyFocus.focusCurrent();
  }, true);
  return null;
});
