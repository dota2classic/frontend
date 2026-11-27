import React from "react";
import { ThreadStore } from "@/store/ThreadStore";

export const ThreadContext = React.createContext<ThreadStore>(
  {} as unknown as never,
);

export const MessageReportsEnabled = React.createContext(true);
