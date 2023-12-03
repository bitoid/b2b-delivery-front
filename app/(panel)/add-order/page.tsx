"use client";
import AddOrderForm from "@/components/AddOrderForm";
import Form from "@/components/AddOrderForm";
import UploadExcelForm from "@/components/UploadExcelForm";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function AddOrderPage() {
  const [manually, setManually] = useState(true);

  return (
    <>
      <div className="flex gap-3 pb-5">
        <button
          type="button"
          className={cn("rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ", manually ? "bg-gray-800 text-white": "")}
          onClick={() => setManually(true)}
        >
          ხელით
        </button>
        <button
          type="button"
          className={cn("rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",  !manually ? "bg-gray-800 text-white": "")}
          onClick={() => setManually(false)}
        >
          ექსელით
        </button>
      </div>

      {manually ? <AddOrderForm /> : <UploadExcelForm />}
    </>
  );
}
