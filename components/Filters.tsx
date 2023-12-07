"use client";

import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import queryString from "query-string";
interface ClientOrderType {
  firstName: string;
  lastName: string;
  address: string;
  town: string;
}

export default function Filters({
  orders,
  searchParams,
}: {
  orders: ClientOrderType[];
  searchParams: any;
}) {
  const [open, setOpen] = useState(false);

  const uniqueOrdersWithFullName = orders.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) => t.firstName === item.firstName && t.lastName === item.lastName
      )
  );

  const uniqueOrdersWithAddress = orders.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.address === item.address)
  );

  const uniqueOrdersWithTows = orders.filter(
    (item, index, self) => index === self.findIndex((t) => t.town === item.town)
  );

  const sortOptions = [
    { name: "ნივთის ღირებულება" },
    { name: "საკურიერო" },
    { name: "ჯამი" },
    { name: "თარიღი" },
  ];

  const filters = [
    {
      id: "town",
      name: "ქალაქი",
      options: uniqueOrdersWithTows.map((item) => {
        return {
          value: item.town,
          label: item.town,
        };
      }),
    },
    {
      id: "firstName",
      name: "სახელი",
      options: uniqueOrdersWithFullName.map((item) => {
        return {
          value: item.firstName,
          label: item.firstName,
        };
      }),
    },
    {
      id: "lastName",
      name: "გვარი",
      options: uniqueOrdersWithFullName.map((item) => {
        return {
          value: item.lastName,
          label: item.lastName,
        };
      }),
    },
    {
      id: "address",
      name: "მისამართი",
      options: uniqueOrdersWithAddress.map((item) => {
        return {
          value: item.address,
          label: item.address,
        };
      }),
    },
  ];

  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, string[]>>(searchParams);

  const updateSelectedFilters = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    setSelectedFilters((prevFilters) => {
      let clone = {};

      if (Array.isArray(prevFilters[filterType])) {
        clone = {
          ...prevFilters,
          [filterType]: checked
            ? [...(prevFilters[filterType] || []), value]
            : prevFilters[filterType].filter((val) => val !== value),
        };
      } else {
        clone = {
          ...prevFilters,
          [filterType]: checked ? [value] : [],
        };
      }

      return clone;
    });
  };

  const generateQueryString = () => {
    if (selectedFilters) return queryString.stringify(selectedFilters);

    return queryString.stringify(searchParams);
  };
  const router = useRouter();

  //change query
  useEffect(() => {
    localStorage.setItem("query", generateQueryString());
    router.push(`/orders?${generateQueryString()}`);
  }, [generateQueryString()]);

  // save query after refresh
  useEffect(() => {
    let query = queryString.stringify(searchParams);
    router.push(`/orders?${query}`);
  }, []);

  const handleCheckboxChange = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    updateSelectedFilters(filterType, value, checked);
    generateQueryString();
  };

  return (
    <div className="bg-gray-50">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.name}
                      className="px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={cn(
                                    open ? "-rotate-180" : "rotate-0",
                                    "h-5 w-5 transform"
                                  )}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-500 "
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Product filters
          </h2>

          <div className="flex items-center justify-between">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  სორტირება
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 px-2 ">
                    {sortOptions.map((option, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <div key={index} className="flex items-center">
                            <input
                              id={`sort-${option.name}}`}
                              name={`${option.name}[]`}
                              defaultValue={option.name}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  "sort",
                                  option.name,
                                  e.target.checked
                                )
                              }
                              checked={
                                Object.keys(searchParams).indexOf("sort") !=
                                  -1 &&
                                (searchParams[option.name] == "sort" ||
                                  searchParams["sort"].indexOf(option.name) !=
                                    -1)
                              }
                            />
                            <label
                              htmlFor={`sort-${option.name}}`}
                              className="ml-3 text-sm text-gray-500 "
                            >
                              {option.name}
                            </label>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setOpen(true)}
            >
              Filters
            </button>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {filters.map((section, sectionIdx) => (
                <Popover
                  as="div"
                  key={section.name}
                  id={`desktop-menu-${sectionIdx}`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{section.name}</span>

                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <form className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              onChange={(e) =>
                                handleCheckboxChange(
                                  section.id,
                                  option.value,
                                  e.target.checked
                                )
                              }
                              checked={
                                Object.keys(searchParams).indexOf(section.id) !=
                                  -1 &&
                                (searchParams[section.id] == option.value ||
                                  searchParams[section.id].indexOf(
                                    option.value
                                  ) != -1)
                              }
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </form>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              ))}
            </Popover.Group>
          </div>
        </section>
      </div>
    </div>
  );
}
