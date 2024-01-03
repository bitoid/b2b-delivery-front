import { ClientOrderType } from "@/types/orders";
import React, { useContext, useState } from "react";
import { TableContext } from "./Table";
import OrderForm from "./OrderForm";

const DeleteModal = ({
  setIsDelete,
  id,
}: {
  setIsDelete: (isDelete: boolean) => void;
  id: number;
}) => {
  const context = useContext(TableContext);
  const handleDelete = async () => {
    const order = context.orders.find((order) => order.id === id);
    if (order) {
      context.orders.splice(context.orders.indexOf(order), 1);
      context.setOrders([...context.orders]);
    }
    context.setIsEdit(false);
    try {
      const response = await fetch(`${process.env.API_URL}/orders/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${context.user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="fixed z-30 bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 w-[90%] max-w-[300px] rounded-[10px]">
      <p className="text-black">ნამდვილად გსურთ წაშლა?</p>
      <div className="flex justify-between mt-12">
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-[#2e9611] px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          დათანხმება
        </button>
        <button
          className="inline-flex items-center gap-x-1.5 rounded-md bg-[#cc3931] px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setIsDelete(false)}
        >
          უარყოფა
        </button>
      </div>
    </div>
  );
};

export default function EditOrder({ order }: { order: ClientOrderType }) {
  const context = useContext(TableContext);
  const [isDelete, setIsDelete] = useState(false);

  const onSubmit = async (data: ClientOrderType) => {
    const modifiedData = { ...data };
    if (context.user?.user_data.user_type != "admin") {
      modifiedData.item_price = order.item_price;
      modifiedData.courier_fee = order.courier_fee;
      modifiedData.sum = order.sum;
    }

    modifiedData.created_at = order.created_at;

    context.orders[context.orders.indexOf(order)] = modifiedData;

    try {
      const response = await fetch(
        `${process.env.API_URL}/orders/${order.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${context.user?.token}`,
          },
          body: JSON.stringify(modifiedData),
        }
      );
      context.setOrders([...context.orders]);
      context.setIsEdit(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return isDelete ? (
    <DeleteModal setIsDelete={setIsDelete} id={order.id} />
  ) : (
    <OrderForm
      onSubmit={onSubmit}
      order={order}
      mode="edit"
      setIsDelete={setIsDelete}
    />
  );
}
