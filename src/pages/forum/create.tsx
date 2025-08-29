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
import { handleException } from "@/util/handleException";
import { useTranslation } from "react-i18next";

interface Props {
  threadType: ThreadType;
}
export default function CreateThreadPage({ threadType }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const createThread = useCallback(async () => {
    try {
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
    } catch (e) {
      await handleException(t("create_thread.errorCreatingPost"), e);
    }
  }, [content, title, threadType, router, t]);

  return (
    <Panel className={c.createThread}>
      <EmbedProps
        title={t("create_thread.seo.title")}
        description={t("create_thread.seo.description")}
      />
      <h2>{t("create_thread.topicTitle")}</h2>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("create_thread.placeholderTopicTitle")}
      />
      <h2>{t("create_thread.message")}</h2>
      <MarkdownTextarea
        className={c.text}
        placeholder={t("create_thread.placeholderMessage")}
        value={content}
        rows={8}
        onChange={(e) => {
          setContent(e.target.value!);
        }}
      />
      <br />
      <br />
      <Button mega onClick={createThread}>
        {t("create_thread.createTopic")}
      </Button>
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
