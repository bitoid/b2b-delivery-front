import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import queryString from "query-string";
import OrderTable from "@/components/Table";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
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
  // const filteredOrders: ClientOrderType[] = await getFilteredOrders(
  //   searchParams
  // );

  const user = await getCurrentUser();

  const filteredData: ClientOrderType[] = await getFilteredOrders(searchParams);
  const orders: ClientOrderType[] = await getOrders();

  return (
    <>
      <OrderTable
        data={orders}
        filteredData={filteredData}
        searchParams={searchParams}
      />
    </>
  );
}

const getFilteredOrders = async (searchParams: ParamsType) => {
  const query = queryString.stringify(searchParams);
  try {
    let response = await fetch(`http://localhost:4000/orders?${query}`, {
      cache: "no-store",
    });
    let orders = await response.json();
    return orders;
  } catch (err) {
    console.log(err);
  }
};

const getOrders = async () => {
  try {
    let response = await fetch(`http://localhost:4000/orders`, {
      cache: "no-store",
      // headers: {
      //   Authorization: `Token ${token}`,
      // },
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
