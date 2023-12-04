import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ExcelForm() {
  return (
    <form action="/action_page.php">
     <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>ატვირთეთ ექსელის ფაილი</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">ან ხელით ჩააგდეთ</p>
                  </div>
                </div>
              </div>
    </form>
  );
}
