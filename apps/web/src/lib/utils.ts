import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | undefined | false | null)[]) {
  return twMerge(classes.filter(Boolean) as string[]);
}

// Base UI components accept className as string | ((state) => string) | undefined.
// This helper narrows it to plain string so cn() stays properly typed.
export type WithStringClassName<T> = Omit<T, "className"> & {
  className?: string;
};
