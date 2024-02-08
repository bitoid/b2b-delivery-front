import { ClientOrderType } from "@/types/order";
import { ClassValue, clsx } from "clsx";
import queryString from "query-string";
import { twMerge } from "tailwind-merge";

/////////////////////////for tailwind classnames/////////////////////////
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

////////////////////////table utils////////////////////////
export function getUniques(data: ClientOrderType[], fieldName: string) {
  return data
    ?.filter(
      (item: any, index, self) =>
        index === self.findIndex((t: any) => t[fieldName] === item[fieldName])
    )
    .map((item: any) => {
      return {
        text: item[fieldName],
        value: fieldName == "client_name" ? item["client"] : item[fieldName],
      };
    });
}
export function getDefaultFilter(storedQuery: string | null, key: string) {
  const keyQuery = storedQuery
    ? queryString.parse(storedQuery, { arrayFormat: "comma" })[key]
    : null;
  const parsedKeyQuery = Array.isArray(keyQuery)
    ? keyQuery
    : keyQuery
    ? [keyQuery]
    : null;

  const defaultFilter =
    parsedKeyQuery && parsedKeyQuery.length > 0 ? parsedKeyQuery : null;

  return defaultFilter as any;
}

export function getColorForStatus(status: string) {
  switch (status) {
    case "DF":
      return "gray";
    case "RD":
      return "red";
    case "YL":
      return "orange";
    case "GR":
      return "green";
    case "BK":
      return "black";
  }
}
