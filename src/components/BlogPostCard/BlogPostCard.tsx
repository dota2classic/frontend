import cx from "clsx";
import Link from "next/link";
import c from "./BlogPostCard.module.scss";

interface BlogPostCardProps {
  href: string;
  title: string;
  date: string;
  description?: string;
  imageUrl?: string;
  featured?: boolean;
  className?: string;
}

export function BlogPostCard({
  href,
  title,
  date,
  description,
  imageUrl,
  featured,
  className,
}: BlogPostCardProps) {
  return (
    <Link
      href={href}
      className={cx(c.card, featured && c.cardFeatured, className)}
    >
      {imageUrl && (
        <div className={c.image}>
          <img src={imageUrl} alt={title} loading="lazy" />
        </div>
      )}
      <div className={c.body}>
        <div className={c.date}>{date}</div>
        <div className={cx(c.title, featured && c.titleFeatured)}>{title}</div>
        {description && <div className={c.desc}>{description}</div>}
        <div className={c.readMore}>Читать →</div>
      </div>
    </Link>
  );
}
