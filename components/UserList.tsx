"use client";

import { Modal, Select, SelectProps } from "antd";
import React, { useState } from "react";
import UserForm from "./UserForm";
import { UserInfoType } from "@/types/user";
import { EditFilled } from "@ant-design/icons";
import Entity from "@ant-design/cssinjs/lib/Cache";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";

const options: SelectProps["options"] = [
  { value: "client", label: "კლიენტი" },
  { value: "courier", label: "კურიერი" },
];

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

export default function UserList({
  couriers,
  clients,
  token,
}: {
  couriers: UserInfoType[];
  clients: UserInfoType[];
  token: string | undefined;
}) {
  const [isAddUser, setIsAddUser] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);
  // const [role, setRole] = useState("ყველა");
  const [userList, setUserList] = useState<UserInfoType[]>([
    ...couriers,
    ...clients,
  ]);

  const [editUser, setEditUser] = useState<UserInfoType | null>(null);

  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between">
        <fieldset className="mt-6">
          <legend className="block text-sm font-medium leading-6 text-gray-900">
            მომხმარებლის როლი
          </legend>
          <div className="mt-2 -space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="country" className="sr-only">
                როლი
              </label>
              <StyleProvider cache={cache}>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  onChange={handleChange}
                  options={options}
                />
              </StyleProvider>
            </div>
          </div>
        </fieldset>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsAddUser(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            დამატება
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 overflow-y-auto max-h-[75vh] custom-scroll">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      მომხმარებელი
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      მეილი
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ტელ. ნომერი
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      როლი
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">განახლება</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {userList.map((user: UserInfoType) => (
                    <tr key={user.user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.user.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.phone_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.user.is_staff
                          ? user.user.id == 1
                            ? "ადმინი"
                            : "კურიერი"
                          : "კლიენტი"}
                      </td>
                      <td
                        className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                        onClick={() => {
                          setIsEditUser(true), setEditUser(user);
                        }}
                      >
                        <EditFilled className="w-6 h-6 text-indigo-600 hover:text-indigo-900" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isAddUser}
        onCancel={() => setIsAddUser(false)}
        footer={null}
        width={700}
      >
        <UserForm
          token={token}
          setIsAddUser={setIsAddUser}
          setUserList={setUserList}
          mode="add"
        />
      </Modal>
      {isEditUser && (
        <Modal
          open={isEditUser}
          onCancel={() => setIsEditUser(false)}
          footer={null}
          width={700}
        >
          <UserForm
            token={token}
            setIsAddUser={setIsEditUser}
            setUserList={setUserList}
            userList={userList}
            mode="edit"
            userData={editUser}
          />
        </Modal>
      )}
    </div>
  );
}
