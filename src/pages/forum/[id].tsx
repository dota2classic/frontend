import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { Thread } from "@/components";
import { useApi } from "@/api/hooks";
import { ThreadDTO, ThreadMessageDTO } from "@/api/back";
import { NextPageContext } from "next";

interface Props {
  messages: ThreadMessageDTO[];
}

export default function ThreadPage({ messages }: Props) {
  const r = useRouter();
  return (
    <>
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
    messages: await useApi().forumApi.forumControllerGetMessages(
      tid,
      ThreadType.FORUM,
    ),
  };
};
