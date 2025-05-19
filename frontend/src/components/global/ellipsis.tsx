import type { ReactNode } from "react";

export const Ellipsis = ({
  children,
  width,
}: {
  children: ReactNode;
  width?: string;
}) => {
  return (
    <p
      className="overflow-auto text-ellipsis"
      style={{ maxWidth: width ? width : "100%" }}
    >
      {children}
    </p>
  );
};
