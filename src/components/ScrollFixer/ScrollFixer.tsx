"use client";
import React, {useEffect} from "react";
import {usePathname} from "next/navigation";

export const ScrollFixer = () => {
  // when clicking a link, user will not scroll to the top of the page if the header is sticky.
  // their current scroll position will persist to the next page.
  // this useEffect is a workaround to 'fix' that behavior.

  const pathname = usePathname();
  useEffect(() => {
    setTimeout(() => {
      console.log("Fix scroll here")
      window.scroll(0, 0);
    }, 50)
  }, [pathname]);
  return <></>;
};
