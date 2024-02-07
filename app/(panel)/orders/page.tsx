import { ClientOrderType } from "@/types/order";
import { Metadata } from "next";
import OrderTable from "@/components/Table";
import { getCurrentUser } from "@/lib/session";
import queryString from "query-string";
import SearchParamsType from "@/types/searchParams";

export const metadata: Metadata = {
  title: "გაგზავნილი შეკვეთები",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParamsType;
}) {
  const user = await getCurrentUser();

  const filteredOrders: ClientOrderType[] = await getOrders(
    user?.token,
    searchParams
  );
  const orders: ClientOrderType[] = await getFilteredOrders(user?.token);
  console.log(orders);
  return (
    <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6 ">
      <OrderTable
        data={orders}
        filteredOrders={filteredOrders}
        searchParams={searchParams}
        user={user}
      />
    </div>
  );
}

const getOrders = async (
  token: string | undefined,
  searchParams: SearchParamsType
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
