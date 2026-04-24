import React from "react";
import { Badge } from "@/components/Badge";
import { BadgeVariant } from "@/components/Badge/Badge";
import { TranslationKey } from "@/TranslationKey";
import { useTranslation } from "react-i18next";

interface StatusBadgeProps<TStatus extends string | number>
  extends Omit<React.ComponentProps<typeof Badge>, "variant"> {
  status: TStatus;
  translationKey: (status: TStatus) => TranslationKey;
  variantMap: Record<TStatus, BadgeVariant>;
}

export function StatusBadge<TStatus extends string | number>({
  status,
  translationKey,
  variantMap,
  children,
  ...props
}: StatusBadgeProps<TStatus>) {
  const { t } = useTranslation();

  return (
    <Badge {...props} variant={variantMap[status]}>
      {children ?? t(translationKey(status))}
    </Badge>
  );
}
