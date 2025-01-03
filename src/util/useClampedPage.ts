import { useEffect } from "react";
import { numberOrDefault } from "@/util/urls";

export const useClampedPage = (
  page: number | string | undefined,
  totalPages: number | undefined,
  setPage: (p: number | string) => void,
) => {
  useEffect(() => {
    if (totalPages !== undefined && numberOrDefault(page, 0) >= totalPages) {
      console.log("Clamp", totalPages, page);
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);
};
