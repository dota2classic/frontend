import React from "react";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";
import { ThreadInputData } from "@/containers/Thread/ThreadInputData";

export interface ThreadContextData {
  thread: ThreadContainer;
  input: ThreadInputData;
}

export const ThreadContext = React.createContext<ThreadContextData>(
  {} as unknown as never,
);
