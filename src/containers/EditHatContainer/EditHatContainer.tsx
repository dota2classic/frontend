import React, { useCallback } from "react";
import {
  ProductDto,
  StoreCategoryDto,
  StoreCreateProductDto,
  StoreItemHolderDto,
  UploadedImageDto,
} from "@/api/back";
import { getApi } from "@/api/hooks";
import { observer, useLocalObservable } from "mobx-react-lite";
import { AppRouter } from "@/route";
import {
  Button,
  Form,
  ImagePickerUploader,
  Input,
  ScrollableCarousel,
  SelectOptions,
} from "@/components";
import Image from "next/image";
import { FaCoins } from "react-icons/fa";
import c from "./EditHatContainer.module.scss";

interface IEditHatContainerProps {
  hat?: StoreItemHolderDto;
}

export const EditHatContainer: React.FC<IEditHatContainerProps> = observer(
  ({ hat: initialHat }) => {
    const { data } = getApi().store.useStoreControllerCategories();
    const categories: StoreCategoryDto[] = data || [];

    const dto = useLocalObservable<
      Omit<StoreCreateProductDto, "imageKey" | "category"> & {
        image?: UploadedImageDto;
        category?: string;
      }
    >(() => ({
      title: initialHat?.title || "Продукт",
      image: initialHat?.image,
      price: initialHat?.price || 100,
      category: initialHat?.categoryId || categories[0]?.category,
    }));

    const valid = dto.category && dto.image && dto.title.length > 0;

    const save = useCallback(async () => {
      const { image, category, ...updateDto } = dto;
      if (!category || !image) return;

      if (initialHat?.id) {
        await getApi()
          .adminStore.adminStoreControllerUpdateProduct(initialHat.id, {
            ...updateDto,
            category,
            imageKey: image.key,
          })
          .then((product) => {
            return AppRouter.admin.store.editProduct(product.id).open();
          });
      } else {
        await getApi()
          .adminStore.adminStoreControllerCreateProduct({
            ...updateDto,
            category,
            imageKey: image.key,
          })
          .then((product) => {
            return AppRouter.admin.store.editProduct(product.id).open();
          });
      }
    }, []);

    return (
      <Form>
        <h3>Название товара</h3>
        <Input
          value={dto.title}
          onChange={(e) => (dto.title = e.target.value)}
        />

        <h3>Цена</h3>
        <Input
          type={"number"}
          value={dto.price}
          onChange={(e) => {
            dto.price = Number(e.target.value);
          }}
        />

        <h3>Карточка товара</h3>
        <ImagePickerUploader onSelectImage={(img) => (dto.image = img)} />
        <ScrollableCarousel>
          <div className={c.hat}>
            <Image
              width={100}
              height={100}
              src={dto.image?.url || "/avatar.png"}
              alt=""
            />
            <span className={c.hat__price}>
              <FaCoins /> {dto.price}
            </span>
          </div>
        </ScrollableCarousel>

        <h3>Категория</h3>
        <SelectOptions
          options={categories.map((category) => ({
            label: category.category,
            value: category.category,
          }))}
          selected={dto.category}
          onSelect={(value, meta) => {
            if (meta.action === "select-option") {
              dto.category = value.value;
            }
          }}
          defaultText={"Категория товара"}
        />

        <Button disabled={!valid} onClick={save}>
          Сохранить
        </Button>
      </Form>
    );
  },
);
