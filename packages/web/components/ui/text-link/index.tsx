import { LinkProps } from "next/dist/client/link";
import Link from "next/link";
import React from "react";

type TextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps;

export const TextLink: React.FC<React.PropsWithChildren<TextLinkProps>> = ({
  children,
  ...props
}) => {
  return (
    <Link
      {...props}
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-400"
    >
      {children}
    </Link>
  );
};
