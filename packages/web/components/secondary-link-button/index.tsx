import React from "react";

interface SecondaryLinkButtonProps extends React.PropsWithChildren {
  href: string;
}

export const SecondaryLinkButton: React.FC<SecondaryLinkButtonProps> = ({
  href,
  children,
}) => {
  return (
    <a
      className="btn text-gray-600 bg-transparent border-gray-400 rounded-md hover:bg-neutral-200 transition-all duration-500 w-auto self-start sm:w-auto sm:ml-4"
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};
