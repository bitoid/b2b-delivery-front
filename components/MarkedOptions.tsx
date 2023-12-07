"use client";

import { useMarkedOrderStore } from "@/store/orders";
export default function MarkedOptions() {
  const { markedOrders } = useMarkedOrderStore();
  return markedOrders.length > 0 ? (
    <div className="flex gap-6 relative">
      <p className="whitespace-nowrap py-5 text-right text-sm font-semibold sm:pr-0 text-indigo-700 hover:text-indigo-900 hover:cursor-pointer hover:underline ">
        სმს-ების გაგზავნა ადრესატებისთვის
      </p>{" "}
      <p className="  whitespace-nowrap py-5 text-right text-sm font-semibold sm:pr-0 text-indigo-700 hover:text-indigo-900 hover:cursor-pointer hover:underline">
        შეკვეთების წაშლა
      </p>
    </div>
  ) : null;
}
