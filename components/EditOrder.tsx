import { ClientOrderType } from "@/types/order";
import React, { useContext, useState } from "react";
import OrderForm from "./OrderForm";
import { TableContext } from "@/context/tableContext";

export const DeleteModal = ({
  setIsDelete,
  handleDelete,
}: {
  setIsDelete: (isDelete: boolean) => void;
  handleDelete: () => void;
}) => {
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
  const handleDelete = async () => {
    const deletedOrder = context.orders.find((item) => item.id == order.id);
    try {
      const response = await fetch(
        `${process.env.API_URL}/orders/${order.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${context.user?.token}`,
          },
        }
      );

      console.log(response);
      if (response.ok) {
        deletedOrder &&
          context.orders.splice(context.orders.indexOf(deletedOrder), 1);

        context.setOrders([...context.orders]);
        context.setIsEdit(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onSubmit = async (data: ClientOrderType) => {
    const modifiedData = { ...data };
    if (context.user?.user_data.user_type != "admin") {
      modifiedData.item_price = order.item_price;
      modifiedData.courier_fee = order.courier_fee;
      modifiedData.sum = order.sum;
    }

    modifiedData.created_at = order.created_at;

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
      const editedOrder = await response.json();
      if (response.ok) {
        context.orders[context.orders.indexOf(order)] = editedOrder;
        context.setOrders([...context.orders]);
        context.setIsEdit(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return isDelete ? (
    <DeleteModal setIsDelete={setIsDelete} handleDelete={handleDelete} />
  ) : (
    <OrderForm
      onSubmit={onSubmit}
      order={order}
      mode="edit"
      setIsDelete={setIsDelete}
    />
  );
}
