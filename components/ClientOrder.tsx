"use client";

import { ClientOrderType } from "@/types/orders";
import { useState } from "react";
import EditOrder from "./EditOrder";
import BlackScreen from "./BlackScreen";
import { useMarkedOrderStore } from "@/store/orders";
import { cn } from "@/lib/utils";
export default function ClientOrder({ order }: { order: ClientOrderType }) {
  const [isDetails, setIsDetails] = useState(false);
  const [isComment, setIsComment] = useState(false);
    const {markedOrders, add: addMarkedOrders, remove: removeMarkedOrders} = useMarkedOrderStore()
  return (
    <>
      <tr className={cn(" rounded-[10px]", markedOrders.indexOf(order.id) != -1 ? "bg-[#c2dbff]": "")}>
        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0 ">
          <input
            id="comments"
            aria-describedby="comments-description"
            name="comments"
            type="checkbox"
            className=""
            checked={markedOrders.indexOf(order.id) != -1}
            onChange={(e) => {
                if(e.target.checked) {
                    addMarkedOrders(order.id)}

                 else {
                    removeMarkedOrders(order.id)
                }}
            }
          />
        </td>
        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-3 ">
          {order.town}
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          {order.fullName}
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          {order.phone}
        </td>
        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          {order.address}
        </td>
        <td
          className=" px-3 py-5 text-sm text-gray-500 cursor-pointer min-w-[120px] relative"
          onMouseOver={() => setIsComment(true)}
          onTouchStart={() => setIsComment(true)}
          onMouseLeave={() => setIsComment(false)}
        >
          {isComment && order.comment ? (
            <span className="bg-white absolute break-words w-[350px] p-2 z-10 rounded-[5px] shadow-2xl">
              {order.comment}
            </span>
          ) : (
            order.comment.slice(0, 10) + "..."
          )}
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
          განახლება
        </td>
      </tr>
      {isDetails && (
        <>
          <EditOrder order={order} />{" "}
          <BlackScreen
            isBlackScreen={isDetails}
            setIsBlackScreen={setIsDetails}
          />
        </>
      )}
    </>
  );
}
