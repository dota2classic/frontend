import React from "react";

interface MetaStatProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDListElement>,
    HTMLDListElement
  > {
  label?: React.ReactNode;
  value: React.ReactNode;
}

export const MetaStat: React.FC<MetaStatProps> = ({
  label,
  value,
  children,
  ...props
}) => {
  return (
    <dl {...props}>
      <dd>{value}</dd>
      <dt>{label}</dt>
      {children}
    </dl>
  );
};
