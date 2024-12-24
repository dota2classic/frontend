import Router from "next/router";
import type { UrlObject } from "url";
import { queryParameters } from "@/util/urls";
import { ThreadType } from "@/api/mapped-models";

export interface NextLinkProp {
  href: string | UrlObject;
  shallow?: boolean;
  passHref: boolean;
  as?: string;
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
      window.open(as as never);
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

const spage = (href: string, shallow: boolean = true) =>
  page(href, href, shallow);

export const AppRouter = {
  index: spage("/"),
  donate: spage("/donate"),
  download: spage("/download"),
  stats: spage("/stats/leaderboard"),
  blog: spage("/blog"),
  queue: spage("/queue"),
  queueGuide: spage("/queue/guide"),
  leaderboard: spage("/stats/leaderboard"),
  live: spage("/stats/live"),

  meta: {
    index: spage("/stats/meta/heroes"),
    hero: (hero: string) =>
      page("/stats/meta/heroes/[id]", `/stats/meta/heroes/${hero}`),
  },
  players: {
    player: {
      index: (id: string | number) => page(`/players/[id]`, `/players/${id}`),
      heroes: (id: string) =>
        page(`/players/[id]/heroes`, `/players/${id}/heroes`),
      teammates: (id: string, _page?: number) => {
        const q = queryParameters({ page: _page });
        return page(
          `/players/[id]/teammates${q}`,
          `/players/${id}/teammates${q}`,
        );
      },
    },
    playerMatches: (
      id: string | number,
      hero?: string,
      _page?: number,
      mode?: number,
    ) => {
      const fhero = (hero && hero.replace("npc_dota_hero_", "")) || undefined;
      const q = queryParameters({
        hero: fhero,
        mode,
        page: _page,
      });
      return page(`/players/[id]/matches${q}`, `/players/${id}/matches${q}`);
    },
    leaderboard: (pg?: number) => {
      const q = queryParameters({ page: pg });
      return page(`/players${q}`, `/players${q}`);
    },
  },

  admin: {
    servers: spage("/admin/servers"),
    queues: spage("/admin/queues"),
    crimes: (pg?: number, steamId?: string) => {
      const q = queryParameters({ page: pg, steam_id: steamId });

      return page(`/admin/crimes${q}`, `/admin/crimes${q}`);
    },
    player: (id: string | number) =>
      page(`/admin/players/[id]`, `/admin/players/${id}`),
    tournamentMatch: {
      match: (id: number) =>
        page(`/admin/tournament_match/[id]`, `/admin/tournament_match/${id}`),
    },
  },
  lobby: {
    index: spage("/lobby"),
    lobby: (id: string) => page(`/lobby/[id]`, `/lobby/${id}`),
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
  heroes: {
    index: spage("/heroes"),
    hero: {
      index: (hero: string) => {
        const fhero = hero.replace("npc_dota_hero_", "");
        return page("/heroes/[hero]", `/heroes/${fhero}`);
      },
      matches: (hero: string, _page?: number) => {
        const fhero = hero.replace("npc_dota_hero_", "");
        const q = queryParameters({ page: _page });
        return page(
          `/heroes/[hero]/matches${q}`,
          `/heroes/${fhero}/matches${q}`,
        );
      },
    },
  },
  forum: {
    index: (_page?: number) => {
      const q = queryParameters({ page: _page });
      return spage(`/forum${q}`);
    },
    createThread: spage("/forum/create"),
    thread(id: string, threadType: ThreadType, _page?: number) {
      const q = queryParameters({ page: _page });
      switch (threadType) {
        case ThreadType.MATCH:
          return page(`/matches/[id]`, `/matches/${id}`);
        case ThreadType.PLAYER:
          return page(`/players/[id]`, `/players/${id}`);

        default:
          return page(`/forum/[id]${q}`, `/forum/${id}${q}`);
      }
    },
  },
  items: {
    index: spage("/items"),
    item: (id: number) => page("/items/[item]", `/items/${id}`),
  },
  matches: {
    match: (id: number) => page(`/matches/[id]`, `/matches/${id}`),
    live: spage("/matches/live"),
    index: (page?: number, mode?: number | string) => {
      const q = queryParameters({
        page,
        mode,
      });
      return spage(`/matches${q}`, false);
    },
    download: (id: number) =>
      page(`/matches/download/[id]`, `/matches/download/${id}`),
  },
};
