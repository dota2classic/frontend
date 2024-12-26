import React from "react";

export interface ThemeContextData {
  newYear: boolean;
}

export const ThemeContext = React.createContext<ThemeContextData>({
  newYear: true,
});
