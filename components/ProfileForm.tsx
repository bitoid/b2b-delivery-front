"use client";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

export default function ProfileForm() {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="mx-auto max-w-2xl space-y-16 lg:mx-0 lg:max-w-none">
      <div>
        <div className="flex justify-between">
          <h2 className="text-base text-[22px] font-semibold leading-7 text-gray-900">
            კომპანიის ინფორმაცია
          </h2>
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setIsEdit(true)}
          >
            განახლება
            <PencilIcon className="block w-6 h-6 company-icon" />
          </button>
        </div>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-bold text-[17px] text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              დასახელება
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <input
                type="text"
                name="company"
                id="company"
                autoComplete="given-name"
                disabled={!isEdit}
                defaultValue={"შპს ზუმერი"}
                className="block w-[300px] rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[17px] sm:leading-6"
              />
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-base text-[22px] font-semibold leading-7 text-gray-900">
          საკონტაქტო პირის ინფორმაცია
        </h2>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-bold text-[17px] text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              სახელი
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                disabled={!isEdit}
                defaultValue={"ბექა"}
                className="block w-[300px] rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[17px] sm:leading-6"
              />
            </dd>
          </div>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-bold text-[17px] text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                გვარი
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="given-name"
                  disabled={!isEdit}
                  defaultValue={"მაისურაძე"}
                  className="block w-[300px] rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[17px] sm:leading-6"
                />
              </dd>
            </div>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6 text-[17px]">
                  ელ. ფოსტა
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="given-name"
                    disabled={!isEdit}
                    defaultValue={"beqamaisuradze912@gmail.com"}
                    className="block w-[100%] max-w-[350px] rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[17px] sm:leading-6"
                  />
                </dd>
              </div>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6 text-[17px]">
                    ტელეფონის ნომერი
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      type="text"
                      name="number"
                      id="number"
                      autoComplete="given-name"
                      disabled={!isEdit}
                      defaultValue={"(+995) 579 09 55 87"}
                      className="block w-[250px] rounded-md  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[17px] sm:leading-6"
                    />
                  </dd>
                </div>
              </dl>
            </dl>
          </dl>
        </dl>
      </div>

      <div>
        <h2 className="text-base text-[22px] font-semibold leading-7 text-gray-900 pb-2">
          მისამართები
        </h2>

        <div className="flex border-t border-gray-100 pt-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-[17px]"
          >
            <span aria-hidden="true">+</span> მისამართის დამატება
          </button>
        </div>
      </div>
      <div className="w-full flex justify-end mt-3 border-none text-xl h-4">
        {isEdit && (
          <button
            type="button"
            className="rounded-md bg-white font-bold text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsEdit(false)}
          >
            შენახვა
          </button>
        )}
      </div>
    </div>
  );
}
