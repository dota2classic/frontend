import c from "./ImageUploadPlugin.module.scss";
import { UploadedImageDto } from "@/api/back";

interface Props {
  images: UploadedImageDto[];
  onSelectImage: (img: UploadedImageDto) => void;
}
export const ImageGalleryModal = ({ images, onSelectImage }: Props) => {
  return (
    <div className={c.gallery}>
      {images.map((img) => (
        <img onClick={() => onSelectImage(img)} src={img.url} key={img.url} />
      ))}
    </div>
  );
};
