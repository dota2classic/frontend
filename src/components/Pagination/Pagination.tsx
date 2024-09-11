import React, { PropsWithChildren } from "react";

import { PageLink } from "..";

import c from "./Pagination.module.scss";
import { NextLinkProp } from "@/route";
import cx from "classnames";

interface IPaginationProps {
  linkProducer: (page: number) => NextLinkProp;
  page: number;
  maxPage: number;
}

const PaginationItem = ({
  children,
  link,
  active,
}: PropsWithChildren<{
  link?: NextLinkProp;
  active?: boolean;
}>) => {
  return (
    <span className={cx(c.page, { [c.active]: active })}>
      {link ? <PageLink link={link}>{children}</PageLink> : <>{children}</>}
    </span>
  );
};

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  maxPage,
  linkProducer,
}) => {
  const horOffset = 4;

  const iter = new Array(horOffset * 2 + 1)
    .fill(null)
    .map((it, index) => index + page - horOffset)
    .filter((it) => it >= 0 && it < maxPage);

  const hasMoreLeft = page - horOffset > 0;
  const hasMoreRight = page + horOffset < maxPage;

  if (iter.length === 1) return null;

  return (
    <nav className={c.pagination}>
      {page > 0 && (
        <>
          <PaginationItem link={linkProducer(0)}>Первая</PaginationItem>
          <PaginationItem link={linkProducer(page - 1)}>Пред.</PaginationItem>
        </>
      )}
      {hasMoreLeft && <PaginationItem>..</PaginationItem>}
      {iter.map((_page) => (
        <PaginationItem
          key={_page}
          link={linkProducer(_page)}
          active={page === _page}
        >
          {_page + 1}
        </PaginationItem>
      ))}
      {hasMoreRight && <PaginationItem>..</PaginationItem>}

      {page < maxPage - 1 && (
        <>
          <PaginationItem link={linkProducer(page + 1)}>
            Следующая
          </PaginationItem>
          <PaginationItem link={linkProducer(maxPage - 1)}>
            Последняя
          </PaginationItem>
        </>
      )}
    </nav>
  );
};
