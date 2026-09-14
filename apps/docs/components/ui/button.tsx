import { cva } from "class-variance-authority";

const variants = {
  ghost: "hover:bg-docs-accent hover:text-docs-accent-foreground",
  outline: "border hover:bg-docs-accent hover:text-docs-accent-foreground",
  primary:
    "bg-docs-primary text-docs-primary-foreground hover:bg-docs-primary/80 disabled:bg-docs-secondary disabled:text-docs-secondary-foreground",
  secondary:
    "border bg-docs-secondary text-docs-secondary-foreground hover:bg-docs-accent hover:text-docs-accent-foreground",
} as const;

const buttonVariants = cva(
  "focus-visible:ring-docs-ring inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: variants,
      size: {
        icon: "p-1.5 [&_svg]:size-5",
        "icon-sm": "p-1.5 [&_svg]:size-4.5",
        "icon-xs": "p-1 [&_svg]:size-4",
        sm: "gap-1 px-2 py-1.5 text-xs",
      },
    },
  },
);

export { buttonVariants };
