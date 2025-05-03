import cx from "clsx";
import c from "@/containers/RichEditor/plugins/ToolbarPlugin/ToolbarPlugin.module.scss";
import { FaFileUpload, FaImage, FaSpinner } from "react-icons/fa";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { createPortal } from "react-dom";
import { observer } from "mobx-react-lite";
import { UploadedImageDto } from "@/api/back";
import { ImageGalleryModal } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageGalleryModal";
import { GenericTooltip } from "@/components";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { $createImageNode } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageNode";
import { useStore } from "@/store";

const ImageUploadPlugin = observer(function ImageUploadPlugin() {
  const [editor] = useLexicalComposerContext();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [isUploading, startUploading] = useTransition();

  const { image: store } = useStore();

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
      if (!evt.clipboardData) return;
      const clipboardItems = evt.clipboardData.items;

      const items = Array.from(clipboardItems).filter(function (item) {
        // Filter the image items only
        return /^image\//.test(item.type);
      });
      if (items.length === 0) {
        return;
      }

      const item = items[0];
      const blob = item.getAsFile();
      if (!blob) return;
      uploadFile(blob);
    };
    document.addEventListener("paste", listener);
    return () => document.removeEventListener("paste", listener);
  }, [uploadFile]);

  return (
    <>
      {visible &&
        ref.current &&
        createPortal(
          <GenericTooltip
            anchor={ref.current!}
            onClose={() => setVisible(false)}
            interactable
          >
            <ImageGalleryModal
              onSelectImage={onSelectImage}
              images={store.gallery}
            />
          </GenericTooltip>,
          document.body,
        )}

      <button
        aria-label="Undo"
        className={cx(c.toolbarItem, c.spaced)}
        onClick={() => setVisible((v) => !v)}
        ref={ref}
      >
        <FaImage />
      </button>

      <button
        disabled={isUploading}
        aria-label="Undo"
        className={cx(c.toolbarItem, c.spaced)}
      >
        <label htmlFor="editor-toolbar-upload-file">
          {isUploading ? (
            <FaSpinner className={c.uploadFileAnimation} />
          ) : (
            <FaFileUpload />
          )}
        </label>
      </button>
      <input
        id="editor-toolbar-upload-file"
        type="file"
        className={c.hiddenInput}
        onChange={handleFileChange}
      />
    </>
  );
});

export default ImageUploadPlugin;
