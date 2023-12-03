import { ClientOrderType } from "@/types/orders";
import React from "react";

export default function ClientOrder({ order }: { order: ClientOrderType }) {
  return (
    <tr key={order.id}>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
        {order.town}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {order.fullName}
      </td>
      {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        Active
      </span>

    </td> */}
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {order.price}₾
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {order.courierPrice}₾
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {order.total()}₾
      </td>
      <td className="relative w-[50px] whitespace-nowrap py-5 text-right text-sm font-semibold sm:pr-0 text-indigo-700 hover:text-indigo-900 hover:cursor-pointer hover:underline">
          დეტალები
      </td>
    </tr>
  );
}
