import React, { PropsWithChildren } from "react";

import { PageLink, Panel } from "..";

import c from "./Pagination.module.scss";
import { NextLinkProp } from "@/route";
import cx from "clsx";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type Action = NextLinkProp | (() => void) | string;
interface IPaginationProps {
  linkProducer: (page: number) => Action;
  page: number;
  maxPage: number;
}

function isPageLink(action: Action): action is NextLinkProp {
  return typeof action === "object" && "href" in action;
}

const PaginationItem = ({
  children,
  link,
  active,
  disabled,
}: PropsWithChildren<{
  link?: Action;
  active?: boolean;
  disabled?: boolean;
}>) => {
  const className = cx(c.page, {
    [c.active]: active,
    [c.disabled]: disabled,
  });
  return link && !disabled ? (
    isPageLink(link) ? (
      <PageLink className={cx(className, "link")} link={link}>
        {children}
      </PageLink>
    ) : (
      <span className={cx(className, "link")} onClick={link as () => void}>
        {children}
      </span>
    )
  ) : (
    <span className={className}>{children}</span>
  );
};

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  maxPage,
  linkProducer,
}) => {
  const horOffset = 1;

  const iter = new Array(horOffset * 2 + 1)
    .fill(null)
    .map((it, index) => index + page - horOffset)
    .filter((it) => it >= 0 && it < maxPage);

  if (iter.length === 1) return null;

  return (
    <Panel className={c.pagination}>
      <PaginationItem disabled={page === 0} link={linkProducer(0)}>
        <HiChevronDoubleLeft />
      </PaginationItem>
      <PaginationItem disabled={page === 0} link={linkProducer(page - 1)}>
        <IoChevronBack />
      </PaginationItem>
      {iter.map((_page) => (
        <PaginationItem
          key={_page}
          link={linkProducer(_page)}
          active={page === _page}
        >
          {_page + 1}
        </PaginationItem>
      ))}
      <PaginationItem
        disabled={page === maxPage - 1}
        link={linkProducer(page + 1)}
      >
        <IoChevronForward />
      </PaginationItem>
      <PaginationItem
        disabled={page === maxPage - 1}
        link={linkProducer(maxPage - 1)}
      >
        <HiChevronDoubleRight />
      </PaginationItem>
    </Panel>
  );
};
