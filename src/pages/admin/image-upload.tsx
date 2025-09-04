import { ImagePickerUploader } from "@/components/ImagePickerUploader";
import { UploadedImageDto } from "@/api/back";
import { useState } from "react";

export default function AdminImageUploadPage() {
  const [selectedImage, setSelectedImage] = useState<
    UploadedImageDto | undefined
  >(undefined);
  return (
    <>
      <pre>{JSON.stringify(selectedImage, null, 2)}</pre>
      {selectedImage && (
        <img
          style={{ width: "200px", height: "auto" }}
          src={selectedImage.url}
        />
      )}
      <ImagePickerUploader onSelectImage={setSelectedImage} />
    </>
  );
}
