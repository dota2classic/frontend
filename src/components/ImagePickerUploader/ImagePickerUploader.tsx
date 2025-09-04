import React, { useCallback, useRef, useState, useTransition } from "react";

import { GenericTooltip } from "../GenericTooltip";

import c from "./ImagePickerUploader.module.scss";
import cx from "clsx";
import { FaFileUpload, FaImage, FaSpinner } from "react-icons/fa";
import { createPortal } from "react-dom";
import { ImageGalleryModal } from "@/containers/RichEditor/plugins/ImageUploadPlugin/ImageGalleryModal";
import { UploadedImageDto } from "@/api/back";
import { useStore } from "@/store";

interface IImagePickerUploaderProps {
  onSelectImage: (img: UploadedImageDto) => void;
}

export const ImagePickerUploader: React.FC<IImagePickerUploaderProps> = ({
  onSelectImage,
}) => {
  const { image: store } = useStore();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [isUploading, startUploading] = useTransition();

  const submitImage = useCallback(
    (img: UploadedImageDto) => {
      setVisible(false);
      onSelectImage(img);
    },
    [onSelectImage],
  );

  const uploadFile = useCallback(
    (file: File) => {
      startUploading(async () => {
        await store
          .uploadImage(file)
          .then(submitImage)
          .catch((e) => {
            console.error("Issue uploading", e);
          });
      });
    },
    [submitImage, store],
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

  return (
    <div className={c.buttons}>
      {visible &&
        ref.current &&
        createPortal(
          <GenericTooltip
            anchor={ref.current!}
            onClose={() => setVisible(false)}
            friends={[ref]}
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
    </div>
  );
};
