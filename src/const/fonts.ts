import { Rubik } from "next/font/google";
import localFont from "next/font/local";

export const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const TrajanPro = localFont({
  src: [
    { path: "../pages/Trajan Pro 3 Regular.otf", weight: "500" },
    { path: "../pages/TrajanPro3SemiBold.ttf", weight: "800" },
  ],
});
