"use client";

import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";

type FormData = {
  user: { username: string; password: string; email: string };
  name: string;
  representative_full_name: string;
  phone_number: string;
  addresses: string;
};

export default function AddUserForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (selected == "კლიენტი") {
      console.log(data);
      try {
        const response = await fetch(`${process.env.API_URL}/clients/`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        console.log(response);
        if (response.ok) {
          message.success(`მომხმარებელი წარმატებით დაემატა`);
          reset();
        } else {
          message.error(`მომხმარებლის დამატება ვერ მოხერხდა`);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      delete (data as Partial<FormData>).addresses;
      delete (data as Partial<FormData>).representative_full_name;

      try {
        const response = await fetch(`${process.env.API_URL}/couriers/`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
        console.log(response);
        if (response.ok) {
          message.success(`მომხმარებელი წარმატებით დაემატა`);
          reset();
        } else {
          message.error(`მომხმარებლის დამატება ვერ მოხერხდა`);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const [selected, setSelected] = useState("კლიენტი");

  useEffect(() => {
    reset({
      user: { username: "", email: "", password: "" },
      name: "",

      representative_full_name: "",
      phone_number: "",
      addresses: "",
    });
  }, [selected]);
  return (
    <div className="w-[100%] max-w-[600px] m-auto">
      <label
        htmlFor="username"
        className="block text-sm font-bold leading-6 text-gray-900"
      >
        მომხმარებლის ტიპი
      </label>
      <div>
        <fieldset className="mt-4">
          <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {["კლიენტი", "კურიერი"].map((user) => (
              <div key={user} className="flex items-center">
                <input
                  id={user}
                  name="notification-method"
                  type="radio"
                  className="h-4 w-4 accent-indigo-600 border-gray-300"
                  onChange={() => setSelected(user)}
                  checked={selected === user}
                />
                <label
                  htmlFor={user}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {user}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  მომხმარებელი
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    {...register("user.username", { required: true })}
                    id="first-name"
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    style={
                      errors.user?.username ? { border: "1px solid red" } : {}
                    }
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  პაროლი
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    {...register("user.password", { required: true })}
                    id="password"
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    style={
                      errors.user?.password ? { border: "1px solid red" } : {}
                    }
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  მეილი
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register("user.email", {
                      required: true,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "invalid email address",
                      },
                    })}
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    style={
                      errors.user?.email ? { border: "1px solid red" } : {}
                    }
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  ტელეფონის ნომერი
                </label>
                <div className="mt-2">
                  <Controller
                    control={control}
                    name="phone_number"
                    rules={{
                      required: true,
                      minLength: 12,
                    }}
                    render={({ field }) => (
                      <ReactInputMask
                        mask={"\\9\\95 99 99 99"}
                        maskChar={null}
                        id="phone_number"
                        {...field}
                        className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        style={
                          errors.phone_number ? { border: "1px solid red" } : {}
                        }
                      />
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-bold leading-6 text-gray-900"
                >
                  სახელი
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: true })}
                    className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    style={errors.name ? { border: "1px solid red" } : {}}
                  />
                </div>
              </div>

              {selected == "კლიენტი" && (
                <>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="representative_full_name"
                      className="block text-sm font-bold leading-6 text-gray-900"
                    >
                      წარმომადგენლის სრული სახელი
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="representative_full_name"
                        {...register("representative_full_name", {
                          required: true,
                        })}
                        className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        style={
                          errors.representative_full_name
                            ? { border: "1px solid red" }
                            : {}
                        }
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="addresses"
                      className="block text-sm font-bold leading-6 text-gray-900"
                    >
                      მისამართი
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="addresses"
                        {...register("addresses", { required: true })}
                        className="block w-full outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        style={
                          errors.addresses ? { border: "1px solid red" } : {}
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            დამატება
          </button>
        </div>
      </form>
    </div>
  );
}
