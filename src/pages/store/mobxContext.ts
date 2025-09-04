import type { RootStore } from "@/store";
import { createContext } from "react";

export const MobxContext = createContext<RootStore>({} as RootStore);
