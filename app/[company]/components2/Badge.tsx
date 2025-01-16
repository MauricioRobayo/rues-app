import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

const badgeStyles = cva(
  "flex items-center gap-1 rounded-full border border-gray-200 px-2 text-xs font-semibold uppercase leading-5",
  {
    variants: {
      status: {
        success: "text-green-600",
        error: "text-red-600",
      },
      type: {
        gray: "bg-gray-50",
        color: null,
      },
    },
    compoundVariants: [
      {
        status: "success",
        type: "color",
        class: "bg-green-50",
      },
      {
        status: "error",
        type: "color",
        class: "bg-red-50",
      },
    ],
  },
);

const indicatorStyles = cva("size-2 rounded-full", {
  variants: {
    status: {
      success: "bg-green-600",
      error: "bg-red-600",
    },
  },
});

export function Badge({
  children,
  status = "success",
  type = "gray",
}: {
  children: ReactNode;
  status?: "success" | "error";
  type?: "gray" | "color";
}) {
  return (
    <div className={badgeStyles({ status, type })}>
      <div className={indicatorStyles({ status })} />
      {children}
    </div>
  );
}
