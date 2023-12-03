import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "პროფილი",
};


export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          კომპანიის ინფორმაცია
        </h2>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              დასახელება
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">შპს ზუმერი</div>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                განახლება
              </button>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          საკონტაქტო პირის ინფორმაცია
        </h2>

        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          <div className="pt-6 sm:flex">
            <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              სახელი
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <div className="text-gray-900">ბექა</div>
              <button
                type="button"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                განახლება
              </button>
            </dd>
          </div>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex">
              <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                გვარი
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">მაისურაძე</div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  განახლება
                </button>
              </dd>
            </div>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  ელ. ფოსტის მისამართი
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">
                    beqamaisuradze912@gmail.com
                  </div>
                  <button
                    type="button"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    განახლება
                  </button>
                </dd>
              </div>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-bold text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    ტელეფონის ნომერი
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">579095587</div>
                    <button
                      type="button"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      განახლება
                    </button>
                  </dd>
                </div>
              </dl>
            </dl>
          </dl>
        </dl>
      </div>

      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          მისამართები
        </h2>

        <div className="flex border-t border-gray-100 pt-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            <span aria-hidden="true">+</span> მისამართის დამატება
          </button>
        </div>
      </div>
    </div>
  );
}
