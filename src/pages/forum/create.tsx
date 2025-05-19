import {
  Button,
  EmbedProps,
  Input,
  MarkdownTextarea,
  Panel,
} from "@/components";
import React, { useCallback, useState } from "react";
import c from "./Forum.module.scss";
import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { NextPageContext } from "next";

interface Props {
  threadType: ThreadType;
}
export default function CreateThreadPage({ threadType }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const createThread = useCallback(async () => {
    const res = await getApi().forumApi.forumControllerCreateThread({
      content,
      title,
      threadType,
    });

    const forTicket = res.threadType === ThreadType.TICKET ? "/ticket" : "";

    await router.push(
      `/forum${forTicket}/[id]`,
      `/forum${forTicket}/${res.externalId}`,
    );
  }, [content, title, threadType, router]);

  return (
    <Panel className={c.createThread}>
      <EmbedProps
        title="Создать тему на форуме"
        description="Создать новую тему на форуме. Обсудить насущные вопросы"
      />
      <h3>Название топика</h3>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={"Гена опять запотел в паблике"}
      />
      <h3>Сообщение</h3>
      <MarkdownTextarea
        className={c.text}
        placeholder={"Введите сообщение"}
        value={content}
        rows={8}
        onChange={(e) => {
          setContent(e.target.value!);
        }}
      />
      <br />
      <br />
      {/*<div className={c.createMessage}>*/}
      <Button mega onClick={createThread}>
        Создать тему
      </Button>
      {/*</div>*/}
    </Panel>
  );
}
CreateThreadPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const threadType = (ctx.query.thread_type as ThreadType) || ThreadType.FORUM;

  console.log(threadType);
  return {
    threadType,
  };
};
