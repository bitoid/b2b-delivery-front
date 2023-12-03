"use client";

import { ClientOrderType } from "@/types/orders";
import { useState } from "react";
import OrderDetails from "./OrderDetails";

export default function ClientOrder({ order }: { order: ClientOrderType }) {
  const [isDetails, setIsDetails] = useState(false);
  return (
    <>
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
          {order.price + order.courierPrice}₾
        </td>

        <td
          className=" w-[50px] whitespace-nowrap py-5 text-right text-sm font-semibold sm:pr-0 text-indigo-700 hover:text-indigo-900 hover:cursor-pointer hover:underline"
          onClick={() => setIsDetails(true)}
        >
          დეტალები
        </td>
      </tr>
      {isDetails && (
        <>
          <OrderDetails order={order} />{" "}
          <div
            onClick={() => setIsDetails(false)}
            className="w-[100vw] h-[100vh] absolute bg-black top-0 z-5 left-0 opacity-60"
          ></div>
        </>
      )}
    </>
  );
}
