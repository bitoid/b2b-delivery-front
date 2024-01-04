import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import OrderTable from "@/components/Table";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "გაგზავნილი შეკვეთები",
};

interface ParamsType {
  town: string;
  comment: string;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: ParamsType;
}) {
  const user = await getCurrentUser();

  const orders: ClientOrderType[] = await getOrders(user?.token);
  console.log(orders);
  return <OrderTable data={orders} searchParams={searchParams} user={user} />;
}

const getOrders = async (token: string | undefined) => {
  try {
    let response = await fetch(`${process.env.API_URL}/orders/`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let orders = await response.json();

    return orders;
  } catch (err) {
    console.log(err);
  }
};
