"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import React from "react";
import ExcelForm from "./ExcelForm";

import OrderForm from "./OrderForm";
import { ClientOrderType } from "@/types/orders";
import { UserType } from "@/types/user";

export default function AddOrder({
  user,
  setOrders,
  orders,
  setIsAdd,
}: {
  user: UserType | undefined;
  setOrders: (orders: ClientOrderType[]) => void;
  orders: ClientOrderType[];
  setIsAdd: (isAdd: boolean) => void;
}) {
  const [manually, setManually] = useState(true);

  const onSubmit = async (data: ClientOrderType) => {
    const modifiedData = {
      ...data,
      sum: Number(data.item_price) + Number(data.courier_fee),
      status: "DF",
      client: 1,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${process.env.API_URL}/orders/`, {
        method: "POST",
        body: JSON.stringify(modifiedData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
      });
      setOrders([...orders, modifiedData]);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="bg-white shadow-sm ring-1 w-[90%] max-w-[824px]  ring-gray-900/5 sm:rounded-xl md:col-span-2 fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  ">
      <div className="flex gap-3 pl-7 pt-4">
        <button
          type="button"
          className={cn(
            "rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ",
            manually ? "bg-gray-800 text-white" : ""
          )}
          onClick={() => setManually(true)}
        >
          ფორმით
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
            !manually ? "bg-gray-800 text-white" : ""
          )}
          onClick={() => setManually(false)}
        >
          ექსელით
        </button>
      </div>
      {manually ? (
        <OrderForm order={null} onSubmit={onSubmit} mode="add" />
      ) : (
        <ExcelForm />
      )}
    </div>
  );
}
