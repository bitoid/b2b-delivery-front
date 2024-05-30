"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  BuildingOffice2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn, getColorForStatus, getStatusName } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserType } from "@/types/user";
import { NotificationType } from "@/types/notificaition";
import { message } from "antd";
// import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Navigation({
  currentUser,
  notificationsData,
}: {
  currentUser: UserType | undefined;
  notificationsData: NotificationType[];
}) {
  const router = useRouter();
  const navigation = currentUser
    ? [{ name: "გაგზავნილი შეკვეთები", href: "/orders" }]
    : [];
  if (currentUser?.user_data.user_type == "admin") {
    navigation.push({ name: "სისტემის მომხმარებლები", href: "/users" });
  }
  const userNavigation = [
    { name: "პროფილი", href: "/profile", listener: () => {} },
    {
      name: "სისტემიდან გასვლა",
      href: "",
      listener: () => {
        router.push("/login");
      },
    },
  ];

  const pathName = usePathname();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    setNotifications(notificationsData);
  }, []);

  const notificationsToShow = notifications
    ?.filter(
      (notification) =>
        notification.notification_type == "status_updated" &&
        notification.is_read == false
    )
    .map((notification) => {
      return (
        <li
          key={notification.order}
          className="flex justify-between px-4 py-2  gap-2  text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors duration-200 ease-in-out border-b-2 border-gray-100"
        >
          <span className="font-semibold">
            შეიცვალა შეკვეთის (კოდით {notification.order}) სტატუსი:{" "}
            <span
              className="font-bold"
              style={{
                color: getColorForStatus(notification.new_status),
              }}
            >
              {getStatusName(notification.new_status)}
            </span>
          </span>
          <div className="flex flex-col md:flex-row gap-1">
            <button
              className="mr-2 w-full bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition-colors duration-200 ease-in-out"
              onClick={async () => {
                message.loading("დაელოდეთ...");
                try {
                  const response = await fetch(
                    `${process.env.API_URL}/orders/${notification.order}/approve_status/`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Token ${currentUser?.token}`,
                      },
                    }
                  );
                  const response2 = await fetch(
                    `${process.env.API_URL}/notifications/${notification.id}/`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        is_read: true,
                      }),
                      headers: {
                        Authorization: `Token ${currentUser?.token}`,
                      },
                    }
                  );
                  if (response.ok && response2.ok) {
                    message.success("სტატუსი დადასტურებულია");
                    const newNotifications = notifications.filter(
                      (item) => item.id != notification.id
                    );
                    setNotifications(newNotifications);
                  } else {
                    message.error("დაფიქსირდა შეცდომა");
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              დადასტურება
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 ease-in-out"
              onClick={async () => {
                try {
                  message.loading("დაელოდეთ...");
                  const response = await fetch(
                    `${process.env.API_URL}/orders/${notification.order}/disapprove_status/`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Token ${currentUser?.token}`,
                      },
                    }
                  );
                  const response2 = await fetch(
                    `${process.env.API_URL}/notifications/${notification.id}/`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        is_read: true,
                      }),
                      headers: {
                        Authorization: `Token ${currentUser?.token}`,
                      },
                    }
                  );

                  if (response.ok && response2.ok) {
                    message.success("სტატუსი უარყოფილია");
                    const newNotifications = notifications.filter(
                      (item) => item.id != notification.id
                    );
                    setNotifications(newNotifications);
                  } else {
                    message.error("დაფიქსირდა შეცდომა");
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              უარყოფა
            </button>
          </div>
        </li>
      );
    });

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    {navigation.map((item, index) => (
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex items-center border-indigo-500 px-1 pt-1 text-sm font-bold text-gray-600 tracking-wide",
                          pathName == item.href ? "border-b-2" : ""
                        )}
                        key={index}
                      >
                        {item.name}
                      </Link>
                    ))}
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    {currentUser?.user_data.user_type == "admin" && (
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open notifications</span>

                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          {notifications?.filter(
                            (notification) =>
                              notification.notification_type ==
                                "status_updated" &&
                              notification.is_read == false
                          ).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                              {
                                notifications.filter(
                                  (notification) =>
                                    notification.notification_type ==
                                      "status_updated" &&
                                    notification.is_read == false
                                ).length
                              }
                            </span>
                          )}
                        </Menu.Button>
                      </div>
                    )}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute w-[300px] md:w-[500px] right-[-70px] md:right-0 z-10 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[60vh] overflow-auto custom-scroll">
                        <ul>
                          {notificationsToShow.length > 0 ? (
                            notificationsToShow
                          ) : (
                            <li className="px-4 py-2 text-sm text-gray-700">
                              შეტყობინებები არ არის
                            </li>
                          )}
                        </ul>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-5 flex">
                    <div>
                      <Menu.Button className="relative flex items-center text-[18px] mx-auto rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {currentUser?.user_data.user_type == "client" ? (
                          <BuildingOffice2Icon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6" aria-hidden="true" />
                        )}
                        {currentUser?.user_data.username}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-7 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item, index) => (
                          <Menu.Item key={index}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={cn(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={item.listener}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-4 pt-2">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                {navigation.map((item, index) => (
                  <Disclosure.Button
                    key={index}
                    as={"a"}
                    href={item.href}
                    className={cn(
                      "block  py-2 pl-3 pr-4 text-base font-medium text-indigo-700",
                      pathName == item.href
                        ? "border-l-4 border-indigo-500 bg-indigo-50"
                        : ""
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
