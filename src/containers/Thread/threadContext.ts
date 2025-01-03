import React from "react";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";

export interface ThreadContextData {
  thread: ThreadContainer;
}

export const ThreadContext = React.createContext<ThreadContextData>(
  {} as unknown as never,
);
