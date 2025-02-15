import { useStore } from "@/store";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { UploadedImageDto } from "@/api/back";
import { $createImageNode } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageNode";
import { $insertNodes } from "lexical";

export const useImageUpload = () => {
  const { image: store } = useStore();
  const [editor] = useLexicalComposerContext();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [isUploading, startUploading] = useTransition();

  const onSelectImage = useCallback(
    (img: UploadedImageDto) => {
      setVisible(false);
      editor.update(() => {
        // Create a new ParagraphNode
        const imageNode = $createImageNode(img.url);

        $insertNodes([imageNode]);
        // Finally, append the paragraph to the root
      });
    },
    [editor],
  );

  const showImagePicker = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const uploadFile = useCallback(
    (file: File) => {
      startUploading(async () => {
        await store.uploadImage(file).then(onSelectImage);
      });
    },
    [onSelectImage, store],
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files![0];
        uploadFile(file);
      }
    },
    [uploadFile],
  );

  useEffect(() => {
    const listener = function (evt: ClipboardEvent) {
      const clipboardItems = evt.clipboardData.items;
      const items = [].slice.call(clipboardItems).filter(function (item) {
        // Filter the image items only
        return /^image\//.test(item.type);
      });
      if (items.length === 0) {
        return;
      }

      const item = items[0];
      const blob = item.getAsFile();
      uploadFile(blob);
    };
    document.addEventListener("paste", listener);
    return () => document.removeEventListener("paste", listener);
  }, [uploadFile]);

  return [handleFileChange, showImagePicker];
};
