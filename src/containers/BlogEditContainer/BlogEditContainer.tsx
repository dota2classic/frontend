import React, { useCallback, useState } from "react";

import { RichEditor } from "..";
import { BlogpostDto, UploadedImageDto } from "@/api/back";
import { useDebounce } from "react-use";
import { SerializedEditorState } from "lexical";
import { getApi } from "@/api/hooks";
import {
  Button,
  Carousel,
  CarouselItem,
  ImagePickerUploader,
  Input,
  MarkdownTextarea,
} from "@/components";
import { useRouter } from "next/router";
import { AppRouter } from "@/route";
import c from "./BlogEditContainer.module.scss";

interface IBlogEditContainerProps {
  post?: BlogpostDto;
}

export const BlogEditContainer: React.FC<IBlogEditContainerProps> = ({
  post,
}) => {
  const router = useRouter();

  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.shortDescription || "");

  const [value, setValue] = useState<SerializedEditorState>(
    post ? JSON.parse(post.content) : undefined,
  );

  const [image, setImage] = useState<UploadedImageDto | undefined>(post?.image);

  useDebounce(
    () => {
      if (!title && !description && !image?.key) return;
      const doRedirect = !post;

      getApi()
        .blog.blogpostControllerUpdatePostDraft({
          id: post?.id,
          title: title,
          content: JSON.stringify(value),
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
    [value, image, title, description],
  );

  const publishPost = useCallback(async () => {
    if (!post) return;
    await getApi().blog.blogpostControllerPublishDraft(post.id);
    router.reload();
  }, [post, router]);

  return (
    <div className={c.editor}>
      <h3>Заголовок статьи</h3>
      <Input
        placeholder={"Заголовок"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <h3>Описание статьи</h3>
      <MarkdownTextarea
        placeholder={"Краткое описание"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <h3>Изображение</h3>
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
      <h3>Содержимое статьи</h3>
      <RichEditor
        saveKey={"edit"}
        onChange={(e) => {
          setValue(e.toJSON());
        }}
      />

      <Button disabled={post?.published} mega onClick={publishPost}>
        Опубликовать
      </Button>
    </div>
  );
};
