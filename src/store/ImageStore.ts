import { observable, runInAction } from "mobx";
import { UploadedImageDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { HydratableStore } from "@/store/HydratableStore";

export class ImageStore implements HydratableStore<unknown> {
  @observable
  gallery: UploadedImageDto[] = [];

  @observable
  contToken: string | undefined = undefined;

  constructor() {
    // if (typeof window !== "undefined") {
    //   this.loadMore();
    // }
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
    const uploadResult =
      await getApi().storageApi.storageControllerUploadImage(file);
    runInAction(() => {
      this.gallery.push(uploadResult);
    });
    return uploadResult;
  };

  hydrate(): void {}
}
