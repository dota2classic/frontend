import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BlogpostDto, UploadedImageDto } from "@/api/back";
import { useDebounce, useLocalStorage } from "react-use";
import { SerializedEditorState } from "lexical";
import { getApi } from "@/api/hooks";
import { useRouter } from "next/router";
import { AppRouter } from "@/route";
import c from "./BlogEditContainer.module.scss";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/Input";
import { MarkdownTextarea } from "@/components/MarkdownTextarea";
import { ImagePickerUploader } from "@/components/ImagePickerUploader";
import { Carousel } from "@/components/Carousel";
import { CarouselItem } from "@/components/CarouselItem";
import { Button } from "@/components/Button";
import { RichEditor } from "../RichEditor";

interface IBlogEditContainerProps {
  post?: BlogpostDto;
}

export const BlogEditContainer: React.FC<IBlogEditContainerProps> = ({
  post,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const saveKey = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_API_URL}-edit-${post?.id || "draft"}`;
  }, [post]);

  const [loaded, setLoaded] = useState(false);

  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.shortDescription || "");
  const [newval, setNewValue] = useLocalStorage<
    [SerializedEditorState, string]
  >(
    saveKey,
    post ? [JSON.parse(post.content), post.renderedContentHtml] : undefined,
  );

  useEffect(() => {
    if (post) {
      setNewValue(JSON.parse(post.content));
    }
    setLoaded(true);
  }, [post, setNewValue]);
  const [image, setImage] = useState<UploadedImageDto | undefined>(post?.image);

  useDebounce(
    () => {
      if (!loaded) return;
      if (!newval) return;
      if (!title && !description && !image?.key) return;
      const doRedirect = !post;

      getApi()
        .blog.blogpostControllerUpdatePostDraft({
          id: post?.id,
          title: title,
          content: JSON.stringify(newval[0]),
          renderedContentHtml: newval[1],
          imageKey: image?.key,
          shortDescription: description,
        })
        .then((res) => {
          if (doRedirect) {
            const link = AppRouter.blog.post(res.id, true).link;
            return router.replace(link.href, link.as);
          }
        });
    },
    500,
    [newval, image, title, description],
  );

  const publishPost = useCallback(async () => {
    if (!post) return;
    await getApi().blog.blogpostControllerPublishDraft(post.id);
    router.reload();
  }, [post, router]);

  return (
    <div className={c.editor}>
      <h3>{t("blog_edit.title")}</h3>
      <Input
        placeholder={t("blog_edit.titlePlaceholder")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <h3>{t("blog_edit.description")}</h3>
      <MarkdownTextarea
        placeholder={t("blog_edit.descriptionPlaceholder")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <h3>{t("blog_edit.image")}</h3>
      <ImagePickerUploader onSelectImage={setImage} />
      {image && (
        <Carousel>
          <CarouselItem
            link={AppRouter.blog.post(-1).link}
            image={image.url}
            title={title}
            description={description}
            date={new Date().toISOString()}
          />
          <CarouselItem
            link={AppRouter.blog.post(-1).link}
            image={image.url}
            title={title}
            description={description}
            date={new Date().toISOString()}
          />
          <CarouselItem
            link={AppRouter.blog.post(-1).link}
            image={image.url}
            title={title}
            description={description}
            date={new Date().toISOString()}
          />
        </Carousel>
      )}
      <h3>{t("blog_edit.content")}</h3>
      {loaded && (
        <RichEditor
          saveKey={saveKey}
          onChange={(serializedState, renderedHtml) => {
            setNewValue([serializedState, renderedHtml]);
          }}
        />
      )}
      <Button disabled={post?.published} mega onClick={publishPost}>
        {t("blog_edit.publish")}
      </Button>
    </div>
  );
};
