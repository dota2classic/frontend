import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import {Breadcrumbs, PageLink, Panel, Thread} from "@/components";
import { getApi } from "@/api/hooks";
import {ThreadDTO, ThreadMessageDTO} from "@/api/back";
import { NextPageContext } from "next";
import {AppRouter} from "@/route";
import {useEffect} from "react";

interface Props {
  messages: ThreadMessageDTO[];
  thread: ThreadDTO;
}

export default function ThreadPage({ messages, thread }: Props) {
  const r = useRouter();
  console.log(r)
  useEffect(() => {
    // document.addEventListener("scrollend", e => {
    //   console.log("Yay remove anchor")
    // })
    // r.replace(r.pathname, `/forum/${thread.externalId}`)
  }, []);

  return (
    <>
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.index().link}>Форум</PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Panel>
      <Thread
        populateMessages={messages}
        threadType={ThreadType.FORUM}
        id={r.query.id as string}
      />
    </>
  );
}

ThreadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const tid = ctx.query.id as string;

  return {
    messages: await getApi().forumApi.forumControllerGetMessages(
      tid,
      ThreadType.FORUM,
    ),
    thread: await getApi().forumApi.forumControllerGetThread(
      tid,
      ThreadType.FORUM,
    )
  };
};
