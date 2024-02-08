import { ClientOrderType } from "@/types/order";
import { Metadata } from "next";
import OrderTable from "@/components/Table";
import { getCurrentUser } from "@/lib/session";
import queryString from "query-string";
import SearchParamsType from "@/types/searchParams";
import { getClients, getCouriers } from "../users/page";

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

  const couriers =
    user?.user_data.user_type == "admin" ? await getCouriers(user?.token) : [];

  const clients =
    user?.user_data.user_type == "admin" ||
    user?.user_data.user_type == "courier"
      ? await getClients(user?.token)
      : [];
  console.log("logg", clients);
  return (
    <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6 ">
      <OrderTable
        data={orders}
        filteredOrders={filteredOrders}
        searchParams={searchParams}
        user={user}
        couriers={couriers}
        clients={clients}
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
    const response = await fetch(`${process.env.API_URL}/orders?${query}`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

const getFilteredOrders = async (token: string | undefined) => {
  try {
    const response = await fetch(`${process.env.API_URL}/orders`, {
      cache: "no-store",
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
