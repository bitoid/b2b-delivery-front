import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import OrderTable from "@/components/Table";
import { getCurrentUser } from "@/lib/session";
import queryString from "query-string";

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

  const filteredOrders: ClientOrderType[] = await getOrders(
    user?.token,
    searchParams
  );
  const orders: ClientOrderType[] = await getFilteredOrders(user?.token);
  console.log(orders);
  return (
    <OrderTable
      data={orders}
      filteredOrders={filteredOrders}
      searchParams={searchParams}
      user={user}
    />
  );
}

const getOrders = async (
  token: string | undefined,
  searchParams: ParamsType
) => {
  const query = queryString.stringify(searchParams, {
    arrayFormat: "comma",
  });
  console.log(query);

  try {
    let response = await fetch(`${process.env.API_URL}/orders?${query}`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getFilteredOrders = async (token: string | undefined) => {
  try {
    let response = await fetch(`${process.env.API_URL}/orders`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
