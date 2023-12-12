import { ClientOrderType } from "@/types/orders";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function getUniques(data: ClientOrderType[], fieldName: string) {
  return data.filter(
    (item: any, index, self) => index === self.findIndex((t: any) => t[fieldName] === item[fieldName])
  ).map((item: any) => {return {text: item[fieldName], value: item[fieldName]}})
}