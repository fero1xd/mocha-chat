import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function betterJsonParse<T>(raw?: string | null): T | null {
  try {
    const r = JSON.parse(raw || "null");
    return r ?? null;
  } catch {
    return null;
  }
}
export function lowerCaseIncludes(term: string, key: string) {
  return term.toLowerCase().includes(key);
}