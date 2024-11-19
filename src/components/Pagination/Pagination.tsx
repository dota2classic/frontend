import React, { PropsWithChildren } from "react";

import { PageLink, Panel } from "..";

import c from "./Pagination.module.scss";
import { NextLinkProp } from "@/route";
import cx from "clsx";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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
  const className = cx(c.page, {
    [c.active]: active,
  });
  return link ? (
    <PageLink className={cx(className, "link")} link={link}>
      {children}
    </PageLink>
  ) : (
    <span className={className}>{children}</span>
  );
};

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  maxPage,
  linkProducer,
}) => {
  const horOffset = 2;

  const iter = new Array(horOffset * 2 + 1)
    .fill(null)
    .map((it, index) => index + page - horOffset)
    .filter((it) => it >= 0 && it < maxPage);

  const hasMoreLeft = page - horOffset > 0;
  const hasMoreRight = page + horOffset < maxPage;

  if (iter.length === 1) return null;

  return (
    <Panel className={c.pagination}>
      {page > 0 && (
        <>
          <PaginationItem link={linkProducer(0)}>
            <HiChevronDoubleLeft />
          </PaginationItem>
          <PaginationItem link={linkProducer(page - 1)}>
            <IoChevronBack />
          </PaginationItem>
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
            <IoChevronForward />
          </PaginationItem>
          <PaginationItem link={linkProducer(maxPage - 1)}>
            <HiChevronDoubleRight />
          </PaginationItem>
        </>
      )}
    </Panel>
  );
};
