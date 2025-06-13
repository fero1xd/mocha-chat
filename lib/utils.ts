import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function betterJsonParse<T>(raw?: string): T | null {
  try {
    const r = JSON.parse(raw || "null");
    return r ?? null;
  } catch {
    return null;
  }
}