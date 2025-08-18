import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, (m, p) => {
      let code = (p as string).charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = "0" + code;
      }
      return "%" + code;
    })
  );
}

export function base64UrlDecode(str: string): string | null {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      console.log("base64 string is not of the correct length");
      return null;
  }

  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
