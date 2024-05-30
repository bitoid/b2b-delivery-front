import { ClientOrderType } from "@/types/order";
import React, { useContext, useState } from "react";
import OrderForm from "./OrderForm";
import { TableContext } from "@/context/tableContext";
import { Modal, message } from "antd";

export const DeleteModal = ({
  setIsDelete,
  handleDelete,
  setIsEdit,
}: {
  setIsDelete: (isDelete: boolean) => void;
  handleDelete: () => void;
  setIsEdit?: (isEdit: boolean) => void;
}) => {
  return (
    <div>
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
          onClick={() => {
            setIsDelete(false);
            setIsEdit && setIsEdit(true);
          }}
        >
          უარყოფა
        </button>
      </div>
    </div>
  );
};

export default function EditOrder({
  order,
  setIsEdit,
}: {
  order: ClientOrderType;
  setIsEdit: (isEdit: boolean) => void;
}) {
  const context = useContext(TableContext);
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = async () => {
    const deletedOrder = context.orders.find((item) => item.id == order.id);
    try {
      message.config({ maxCount: 1 });
      message.loading("დაელოდეთ...");
      const response = await fetch(
        `${process.env.API_URL}/orders/${order.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${context.user?.token}`,
          },
        }
      );

      if (response.ok) {
        deletedOrder &&
          context.orders.splice(context.orders.indexOf(deletedOrder), 1);

        context.setOrders([...context.orders]);
        message.success("შეკვეთა წარმატებით წაიშალა");
        context.setIsEdit(false);
        setIsDelete(false);
      } else {
        message.error("შეკვეთის წაშლა ვერ მოხერხდა");
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
    if (modifiedData.status == "Pending Approval") modifiedData.status = "DF";

    modifiedData.created_at = order.created_at;

    try {
      message.config({ maxCount: 1 });
      message.loading("დაელოდეთ...");
      const response = await fetch(
        `${process.env.API_URL}/orders/${order.id}/`,
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
        message.success("შეკვეთა წარმატებით განახლდა");
        context.setIsEdit(false);
      } else {
        message.error("შეკვეთის განახლება ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal open={isDelete} footer={null} closeIcon={null} centered>
        <DeleteModal
          setIsDelete={setIsDelete}
          handleDelete={handleDelete}
          setIsEdit={setIsEdit}
        />
      </Modal>

      <OrderForm
        onSubmit={onSubmit}
        order={order}
        mode="edit"
        setIsDelete={setIsDelete}
      />
    </>
  );
}
