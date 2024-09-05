import Router from "next/router";

export interface NextLinkProp {
  href: string;
  as?: string;
  shallow?: boolean;
  passHref: boolean;
}
export interface IRouterPage {
  link: NextLinkProp;
  open: (hard?: boolean) => void;
}

export interface IRouterPageablePage extends IRouterPage {
  page: (page: number) => IRouterPage;
}

export const page = (
  href: string,
  as?: string,
  shallow?: boolean,
): IRouterPage => ({
  link: { href, as, shallow, passHref: true },
  open: (hard?: boolean) => {
    if (hard) {
      window.open(as);
    } else {
      return Router.push(href, as);
    }
  },
});

export const pageablePage = (
  href: string,
  as?: string,
): IRouterPageablePage => {
  const createPage = page;

  return {
    ...createPage(href, as),
    page: (page: number = 1) => {
      if (page === 1) return createPage(href, as);
      return createPage(`${href}?page=${page}`, as?.concat(`?page=${page}`));
    },
  };
};

const spage = (href: string) => page(href, href, true);

export const AppRouter = {
  index: spage("/"),
  donate: spage("/donate"),
  download: spage("/download"),
  stats: spage("/stats/leaderboard"),
  blog: spage("/blog"),
  queue: spage("/queue"),
  leaderboard: spage("/stats/leaderboard"),
  live: spage("/stats/live"),

  meta: {
    index: spage("/stats/meta/heroes"),
    hero: (hero: string) =>
      page("/stats/meta/heroes/[id]", `/stats/meta/heroes/${hero}`),
  },
  player: (id: string | number) => page(`/player/[id]`, `/player/${id}`),

  admin: {
    tournamentMatch: {
      match: (id: number) =>
        page(`/admin/tournament_match/[id]`, `/admin/tournament_match/${id}`),
    },
  },
  tournament: {
    index: page("/stats/tournament"),
    tournament: (id: number) =>
      page(`/stats/tournament/[id]`, `/stats/tournament/${id}`),
    bracket: (id: number) =>
      page(`/stats/tournament/[id]/bracket`, `/stats/tournament/${id}/bracket`),
  },
  team: {
    index: page("/stats/team"),
    team: (id: string) => page(`/stats/team/[id]`, `/stats/team/${id}`),
    edit: (id: string) =>
      page(`/stats/team/edit/[id]`, `/stats/team/edit/${id}`),
  },
  tournamentMatch: {
    match: (id: number) =>
      page(
        `/stats/tournament/match/[match_id]`,
        `/stats/tournament/match/${id}`,
      ),
  },
  match: (id: number) => page(`/stats/match/[id]`, `/stats/match/${id}`),
  history: {
    index: spage(`/stats/history`),
  },
};
