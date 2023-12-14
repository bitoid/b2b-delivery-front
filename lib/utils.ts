import { ClientOrderType } from "@/types/orders";
import { ClassValue, clsx } from "clsx";
import queryString from "query-string";
import { twMerge } from "tailwind-merge";

//for tailwind classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//for filters
export function getUniques(data: ClientOrderType[], fieldName: string) {
  return data
    ?.filter(
      (item: any, index, self) =>
        index === self.findIndex((t: any) => t[fieldName] === item[fieldName])
    )
    .map((item: any) => {
      return { text: item[fieldName], value: item[fieldName] };
    });
}

export function getDefaultFilter(storedQuery: string | null, key: string): string[] | undefined {
  const keyQuery = storedQuery ? queryString.parse(storedQuery)[key] : null;
  const parsedKeyQuery = Array.isArray(keyQuery)
    ? keyQuery.filter((value: string | null): value is string => value !== null)
    : keyQuery !== null ? [keyQuery] : null;

  return parsedKeyQuery && parsedKeyQuery.length > 0 ? parsedKeyQuery : undefined;
}
