import { useEffect } from "react";
import { parsePage } from "@/util/urls";

export const useClampedPage = (
  page: number | string | undefined,
  totalPages: number | undefined,
  setPage: (p: number | string) => void,
) => {
  useEffect(() => {
    if (totalPages !== undefined && parsePage(page) >= totalPages) {
      const newPage = Math.max(0, totalPages - 1);
      if ((page === undefined || page === 0) && newPage === 0) {
        return;
      }
      console.log("SetPage called", totalPages, page);
      setPage(newPage);
    }
  }, [page, totalPages]);
};
