"use client";
import { useState } from "react";
import { UserType } from "@/types/user";
import { useForm } from "react-hook-form";
import { message } from "antd";

export default function ProfileForm({ user }: { user: UserType | undefined }) {
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserType>({
    defaultValues: {
      user_data: {
        username: user?.user_data.username,
        profile: {
          name: user?.user_data.profile.name,
          email: user?.user_data.profile.email,
          phone_number: user?.user_data.profile.phone_number,
          representative_full_name:
            user?.user_data.profile.representative_full_name,
        },
      },
    },
  });

  const onSubmit = async (data: UserType) => {
    console.log(data);
    const adminData = {
      username: data.user_data.username,
      email: data.user_data.profile.email,
      is_staff: true,
    };
    try {
      const response = await fetch(
        `${process.env.API_URL}/users/${user?.user_data.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(adminData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        message.success("მომხმარებელი წარმატებით განახლდა");
        setIsEdit(false);
      } else {
        message.error("მომხმარებლის განახლება ვერ მოხერხდა");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Prevent form submission

    if (isEdit) {
      // If isEdit is true, run onSubmit
      await handleSubmit(onSubmit)();
    } else {
      // If isEdit is false, set it to true
      setIsEdit(true);
    }
  };

  console.log(user);
  return (
    <form className="overflow-hidden bg-white shadow sm:rounded-lg p-3">
      <div className="px-4 sm:px-0">
        <h3 className="text-[20px] font-semibold leading-7 text-gray-900">
          მომხმარებლის პროფილი
        </h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className=" px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">
              მომხმარებელი
            </dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEdit ? (
                <input
                  {...register("user_data.username", { required: true })}
                  className="block outline-none w-full max-w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  style={
                    errors.user_data?.username && { border: "1px solid red" }
                  }
                />
              ) : (
                user?.user_data.username
              )}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">
              სახელი
            </dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEdit ? (
                <input
                  style={
                    errors.user_data?.profile?.name && {
                      border: "1px solid red",
                    }
                  }
                  {...register("user_data.profile.name", { required: true })}
                  className="block outline-none w-full max-w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              ) : (
                user?.user_data.profile.name
              )}
            </dd>
          </div>
          {user?.user_data.user_type == "client" && (
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-md font-medium leading-6 text-gray-900">
                წარმომადგენლის სახელი
              </dt>
              <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isEdit ? (
                  <input
                    style={
                      errors.user_data?.profile?.representative_full_name && {
                        border: "1px solid red",
                      }
                    }
                    {...register("user_data.profile.representative_full_name", {
                      required: true,
                    })}
                    className="block outline-none w-full max-w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                ) : (
                  user?.user_data.profile.representative_full_name
                )}
              </dd>
            </div>
          )}
          <div className=" px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">
              ელ-ფოსტა
            </dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEdit ? (
                <input
                  style={
                    errors.user_data?.profile?.email && {
                      border: "1px solid red",
                    }
                  }
                  {...register("user_data.profile.email", { required: true })}
                  className="block outline-none w-full max-w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              ) : (
                user?.user_data.profile.email
              )}
            </dd>
          </div>
          {user?.user_data.user_type != "admin" && (
            <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
              <dt className="text-md font-medium leading-6 text-gray-900">
                ტელეფონის ნომერი
              </dt>
              <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {isEdit ? (
                  <input
                    style={
                      errors.user_data?.profile?.phone_number && {
                        border: "1px solid red",
                      }
                    }
                    {...register("user_data.profile.phone_number", {
                      required: true,
                    })}
                    className="block outline-none w-full max-w-[200px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                ) : (
                  user?.user_data.profile.phone_number
                )}
              </dd>
            </div>
          )}

          {/* <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">
              მისამართები
            </dt>
            <dd className="mt-2 text-md text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-md leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        {userProfile?.addresses}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </dd>
          </div> */}
        </dl>
        <div className="ml-2 mt-4">
          {user?.user_data.user_type == "admin" && (
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={handleButtonClick}
            >
              {isEdit ? "შენახვა" : "რედაქტირება"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
