import { ClientOrderType } from "@/types/orders";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ManuallyForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClientOrderType>();

  const onSubmit = async (data: ClientOrderType) => {
    console.log(data);
    let response = await fetch(`${process.env.API_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...data,
        status: "DF",
        sum: 20,
        client: 2,
        courirer: 2,
      }),
    });

    console.log(response);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="px-4 py-6 sm:p-8 h-[70vh] overflow-y-auto custom-scroll">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ქალაქი
            </label>
            <div className="mt-2">
              <select
                id="country"
                autoComplete="country-name"
                {...register("city")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>თბილისი</option>
                <option>ქუთაისი</option>
                <option>ბათუმი</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              სახელი და გვარი
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="first-name"
                autoComplete="given-name"
                {...register("addressee_full_name")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ტელ. ნომერი
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="phone"
                autoComplete="phone"
                {...register("phone_number")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              მისამართი
            </label>
            <div className="mt-2">
              <input
                id="address"
                type="address"
                {...register("address")}
                autoComplete="address"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              კომენტარი
            </label>
            <div className="mt-2">
              <textarea
                id="comment"
                autoComplete="comment"
                {...register("comment")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="col-span-full sm:flex gap-[100px]">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ნივთის ღირებულება
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="price"
                  {...register("item_price")}
                  autoComplete="price"
                  className="block w-[100%] max-w-[150px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="courier-price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                საკურიერო
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="courier-price"
                  {...register("courier_fee")}
                  autoComplete="price"
                  className="block w-[100%] max-w-[150px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <p className="italic mt-[20px] font-bold">ჯამი:</p>
      </div>
      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          დამატება
        </button>
      </div>
    </form>
  );
}
