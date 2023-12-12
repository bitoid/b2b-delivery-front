"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import React from "react";
import ExcelForm from "./ExcelForm";
  import { useMarkedOrderStore } from "@/store/orders";
  import ManuallyForm from "./ManuallyForm";

export default function AddOrder() {
  const [manually, setManually] = useState(true);
  const {markedOrders} = useMarkedOrderStore()
  console.log(markedOrders)
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
      {manually ? <ManuallyForm /> : <ExcelForm />}
    </div>
  );
}
