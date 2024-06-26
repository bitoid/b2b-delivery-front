import { getColorForStatus } from "@/lib/utils";
import { ClientOrderType } from "@/types/order";
import { ConfigProvider, Select } from "antd";
import { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TableContext } from "@/context/tableContext";
import { DeleteFilled } from "@ant-design/icons";
import InputMask from "react-input-mask";
import Checkbox from "antd/es/checkbox/Checkbox";

export default function OrderForm({
  order,
  onSubmit,
  mode,
  setIsDelete,
}: {
  order: ClientOrderType | null;
  onSubmit: (data: ClientOrderType) => void;
  setIsDelete?: (isDelete: boolean) => void;
  mode: "edit" | "add";
}) {
  const context = useContext(TableContext);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    // formState: { errors },
  } = useForm<ClientOrderType>({
    defaultValues: {
      status:
        mode == "add"
          ? "DF"
          : context.user?.user_data.user_type == "courier"
          ? order?.status_approved
            ? order.status
            : order?.staged_status
          : order?.status,
      address: order?.address,
      city: order?.city,
      comment: order?.comment,
      courier_fee: order?.courier_fee,
      item_price: order?.item_price,
      phone_number: order?.phone_number,
      addressee_full_name: order?.addressee_full_name,
      client: order?.client,
      courier: order?.courier,
      is_taken: order?.is_taken,
    },
  });

  useEffect(() => {
    reset({
      status:
        mode == "add"
          ? "DF"
          : context.user?.user_data.user_type == "courier"
          ? order?.status_approved
            ? order.status
            : order?.staged_status
          : order?.status,
      address: order?.address,
      city: order?.city,
      comment: order?.comment,
      courier_fee: order?.courier_fee,
      item_price: order?.item_price,
      phone_number: order?.phone_number,
      addressee_full_name: order?.addressee_full_name,
      client: order?.client,
      courier: order?.courier,
      is_taken: order?.is_taken,
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" px-4 sm:px-0 flex justify-between">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          შეკვეთის დეტალები
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              სახელი და გვარი
            </label>
            <div className="mt-2">
              <input
                {...register("addressee_full_name", { required: true })}
                disabled={context?.user?.user_data.user_type == "courier"}
                className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="country"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ქალაქი
            </label>
            <div className="mt-2">
              <select
                {...register("city", { required: true })}
                className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                disabled={context?.user?.user_data.user_type == "courier"}
              >
                <option>თბილისი</option>
                <option>ბათუმი</option>
                <option>ქუთაისი</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              მისამართი
            </label>
            <div className="mt-2">
              <input
                {...register("address", { required: true })}
                className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={context?.user?.user_data.user_type == "courier"}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ტელეფონის ნომერი
            </label>
            <div className="mt-2">
              <InputMask
                mask={"\\9\\95 999 999 999"}
                maskChar={null}
                {...register("phone_number", { required: true })}
                className="block w-full  outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                disabled={context?.user?.user_data.user_type == "courier"}
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="street-address"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              კომენტარი
            </label>
            <div className="mt-2">
              <textarea
                {...register("comment", { required: false })}
                className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ფასი
            </label>
            <div className="mt-2">
              {mode == "edit" ? (
                context?.user?.user_data.user_type == "admin" ? (
                  <input
                    {...register("item_price", { required: true })}
                    className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                ) : (
                  <p>{order?.item_price}</p>
                )
              ) : (
                <input
                  {...register("item_price", { required: true })}
                  className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="region"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              საკურიერო
            </label>
            <div className="mt-2">
              {mode == "edit" ? (
                context?.user?.user_data.user_type == "admin" ? (
                  <input
                    {...register("courier_fee", { required: true })}
                    className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                ) : (
                  <p>{order?.courier_fee}</p>
                )
              ) : (
                <input
                  {...register("courier_fee", { required: true })}
                  className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              ჯამი
            </label>
            <div className="mt-2">
              <p>
                {mode == "add"
                  ? (
                      (Number(watch("item_price")) || 0) +
                      (Number(watch("courier_fee")) || 0)
                    ).toFixed(2)
                  : Number(watch("item_price")) && Number(watch("courier_fee"))
                  ? Number(watch("item_price")) + Number(watch("courier_fee"))
                  : Number(order?.item_price) + Number(order?.courier_fee)}
                ლ
              </p>
            </div>
          </div>
          {context.user?.user_data.user_type == "admin" && (
            <>
              {" "}
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  კლიენტი
                </label>
                <div className="mt-2 ">
                  <select
                    {...register("client", { required: true })}
                    className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {context?.clients.map((client) => (
                      <option value={client.id} key={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  კურიერი
                </label>
                <div className="mt-2">
                  <select
                    {...register("courier", { required: true })}
                    className="block w-full outline-none  bg-gray-50 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {context?.couriers.map((courier) => (
                      <option value={courier.id} key={courier.id}>
                        {courier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          {context.user?.user_data.user_type == "admin" && (
            <div className="sm:col-span-3">
              <Controller
                name="is_taken"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="font-medium"
                    {...field}
                    defaultChecked={order?.is_taken}
                  >
                    საწყობიდან გატანილია
                  </Checkbox>
                )}
              />
            </div>
          )}

          {mode == "edit" && context?.user?.user_data.user_type != "client" && (
            <div className="sm:col-span-4 " id="table-select">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900 pb-2"
              >
                სტატუსი
              </label>
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      optionSelectedBg: getColorForStatus(watch("status")),
                      selectorBg: getColorForStatus(watch("status")),
                      borderRadius: 100,
                    },
                  },
                }}
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className={`w-[80px]`}
                      {...field}
                      dropdownStyle={{ width: "190px" }}
                      options={[
                        { label: "სტატუსის გარეშე", value: "DF" },
                        { label: "ჩაბარებულია", value: "GR" },
                        { label: "ჩაბარების პროცესშია", value: "YL" },
                        { label: "ვერ ჩაბარდა", value: "RD" },
                        { label: "დაბრუნებულია", value: "BK" },
                      ]}
                    />
                  )}
                />
              </ConfigProvider>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        {mode == "edit" && context?.user?.user_data.username == "admin" && (
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {
              setIsDelete && setIsDelete(true);
            }}
          >
            შეკვეთის წაშლა
            <DeleteFilled className="block w-6 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="justify-right gap-x-1.5  rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {mode == "edit" ? "შენახვა" : "დამატება"}
        </button>
      </div>
    </form>
  );
}
