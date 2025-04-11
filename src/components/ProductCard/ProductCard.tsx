import React from "react";

import c from "./ProductCard.module.scss";
import { ProductDto } from "@/api/back";
import Image from "next/image";
import { FaCoins } from "react-icons/fa";
import { AppRouter, NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import { IoWarning } from "react-icons/io5";

interface IProductCardProps {
  product: ProductDto;
  link?: NextLinkProp;
}

export const ProductCard: React.FC<IProductCardProps> = ({ product, link }) => {
  return (
    // FIX link to product
    <PageLink link={link || AppRouter.store.index.link}>
      <article className={c.card}>
        <div className={c.card__image}>
          <Image
            className={c.cardImage}
            width={250}
            height={250}
            src={product.image.url}
            alt={`Карточка товара ${product.title}`}
          />
        </div>
        <div className={c.card__name}>{product.title}</div>
        <div className={c.card__price}>
          <span>
            <FaCoins /> {product.price}
          </span>{" "}
          {product.bought && (
            <span>
              <IoWarning /> Уже куплено
            </span>
          )}
        </div>
      </article>
    </PageLink>
  );
};
