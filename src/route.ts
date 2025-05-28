import Router, { NextRouter } from "next/router";
import type { UrlObject } from "url";
import { queryParameters } from "@/util/urls";
import { ThreadType } from "@/api/mapped-models";
import { UserProfileDecorationType } from "@/api/back";

export interface NextLinkProp {
  href: string | UrlObject;
  shallow?: boolean;
  passHref: boolean;
  as?: string;
}

export interface IRouterPage {
  link: NextLinkProp;
  open: (hard?: boolean) => void;
  matches: (router: NextRouter) => boolean;
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
  matches: (router) => {
    return router.asPath === as;
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
  rules: spage("/static/rules"),
  offer: spage("/static/offer"),
  info: spage("/static/info"),
  contact: spage("/static/contact"),
  fullRules: spage("/static/rules/full"),
  stats: spage("/stats/leaderboard"),
  wiki: {
    index: spage("/wiki"),
  },
  records: {
    index: spage("/records"),
  },
  blog: {
    index: spage("/blog"),
    create: spage("/blog/create"),
    post: (id: number, edit: boolean = false) => {
      if (edit) return page("/blog/[id]/edit", `/blog/${id}/edit`);

      return page("/blog/[id]", `/blog/${id}`);
    },
  },
  queue: spage("/queue"),
  queueGuide: spage("/queue/guide"),
  leaderboard: spage("/stats/leaderboard"),
  live: spage("/live/matches"),
  streams: spage("/live/streams"),

  store: {
    index: spage("/store"),
  },

  meta: {
    index: spage("/meta"),
    hero: (hero: string) =>
      page("/stats/meta/heroes/[id]", `/stats/meta/heroes/${hero}`),
  },
  players: {
    player: {
      index: (id: string | number, threadPage?: number) => {
        const q = queryParameters({ page: threadPage });
        return page(`/players/[id]${q}`, `/players/${id}${q}`);
      },
      heroes: (id: string) =>
        page(`/players/[id]/heroes`, `/players/${id}/heroes`),
      records: (id: string) =>
        page(`/players/[id]/records`, `/players/${id}/records`),
      settings: (id: string) =>
        page(`/players/[id]/settings`, `/players/${id}/settings`),
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
    leaderboard: (pg?: number, seasonId?: number) => {
      const q = queryParameters({ page: pg, seasonId });
      return page(`/players${q}`, `/players${q}`);
    },
  },

  admin: {
    servers: spage("/admin/servers"),
    queues: spage("/admin/queues"),
    feedback: {
      index: spage("/admin/feedback"),
      edit: (id: number) =>
        page(`/admin/feedback/edit/[id]`, `/admin/feedback/edit/${id}`),
      create: spage("/admin/feedback/create"),
    },
    rules: {
      editRules: spage(`/admin/rules/edit`),
      editPunishments: spage(`/admin/rules/punishments`),
    },

    decoration: {
      create: (type: UserProfileDecorationType) => {
        const q = queryParameters({ type });

        return spage(`/admin/decoration/create${q}`);
      },
      list: (type?: UserProfileDecorationType) => {
        const q = queryParameters({ type });

        return page(`/admin/decoration${q}`, `/admin/decoration${q}`);
      },
      edit: (id: number) =>
        page("/admin/decoration/[id]", `/admin/decoration/${id}`),
    },

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
    playerFeedback: (pg?: number) => {
      const q = queryParameters({ page: pg });

      return page(`/admin/player-feedback${q}`, `/admin/player-feedback${q}`);
    },
  },
  lobby: {
    index: spage("/lobby"),
    create: spage("/create"),
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
      return spage(`/forum${q}`, false);
    },
    // createThread: spage("/forum/create"),
    createThread(threadType: ThreadType) {
      const q = queryParameters({ thread_type: threadType });
      return spage(`/forum/create${q}`);
    },
    thread(id: string, threadType: ThreadType, _page?: number) {
      const q = queryParameters({ page: _page });
      switch (threadType) {
        case ThreadType.MATCH:
          return page(`/matches/[id]`, `/matches/${id}`);
        case ThreadType.PLAYER:
          return page(`/players/[id]`, `/players/${id}`);
        case ThreadType.TICKET:
          return page(`/forum/ticket/[id]${q}`, `/forum/ticket/${id}`);

        default:
          return page(`/forum/[id]${q}`, `/forum/${id}${q}`);
      }
    },
    ticket: {
      admin: (_page?: number) => {
        const q = queryParameters({ page: _page });
        return spage(`/admin/ticket${q}`, false);
      },
      index: spage("/forum/ticket"),
      ticket(id: string) {
        const numericId = id.replace(/\D/g, "");
        return page("/forum/ticket/[id]", `/forum/ticket/${numericId}`);
      },
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
