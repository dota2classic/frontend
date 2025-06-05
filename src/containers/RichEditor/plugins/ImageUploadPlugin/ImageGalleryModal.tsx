import c from "./ImageUploadPlugin.module.scss";
import { UploadedImageDto } from "@/api/back";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useLayoutEffect } from "react";

interface Props {
  images: UploadedImageDto[];
  onSelectImage: (img: UploadedImageDto) => void;
}
export const ImageGalleryModal = observer(({ onSelectImage }: Props) => {
  const { image } = useStore();

  useLayoutEffect(() => {
    image.loadMore().then();
  });

  return (
    <div className={c.gallery}>
      {image.gallery.map((img) => (
        <img onClick={() => onSelectImage(img)} src={img.url} key={img.url} />
      ))}
    </div>
  );
});
