import { observable, runInAction } from "mobx";
import { UploadedImageDto } from "@/api/back";
import { getApi } from "@/api/hooks";

export class ImageStore {
  @observable
  gallery: UploadedImageDto[] = [];

  @observable
  contToken: string | undefined = undefined;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadMore();
    }
  }

  loadMore = () => {
    return getApi()
      .storageApi.storageControllerGetUploadedFiles(this.contToken)
      .then((data) =>
        runInAction(() => {
          this.gallery.push(...data.items);
          this.contToken = data.ctoken;
        }),
      );
  };

  uploadImage = async (file: File) => {
    try {
      const uploadResult =
        await getApi().storageApi.storageControllerUploadImage(file);
      runInAction(() => {
        this.gallery.push(uploadResult);
      });
      return uploadResult;
    } catch (e) {
      return undefined;
    }
  };
}
