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
  console.log(searchParams);
  const orders: ClientOrderType[] = await getOrders(user?.token);
  const filteredOrders: ClientOrderType[] = await getFilteredOrders(
    user?.token,
    searchParams
  );
  return (
    <OrderTable
      data={orders}
      filteredData={filteredOrders}
      searchParams={searchParams}
      user={user}
    />
  );
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

    let data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

const getFilteredOrders = async (
  token: string | undefined,
  searchParams: any
) => {
  delete searchParams.pageSize;
  delete searchParams.current;
  console.log(
    queryString.stringify(searchParams, {
      arrayFormat: "comma",
    })
  );
  try {
    let response = await fetch(
      `${process.env.API_URL}/orders?${queryString.stringify(searchParams, {
        arrayFormat: "comma",
      })}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    let data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};
