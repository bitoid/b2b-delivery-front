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
  const token = cookies().get("token");

  // if (!token) redirect("/login");
  const user = await getCurrentUser(); // Update type of user

  // END: abpxx6d04wxr

  const orders: ClientOrderType[] = await getOrders(
    user?.token as unknown as RequestCookie
  );
  console.log(user);

  return (
    <>
      <OrderTable
        data={orders}
        // filteredData={filteredOrders}
        searchParams={searchParams}
      />
    </>
  );
}

// const getFilteredOrders = async (searchParams: ParamsType) => {
//   const query = queryString.stringify(searchParams);
//   try {
//     let response = await fetch(`http://localhost:4000/orders?${query}`, {
//       cache: "no-store",
//     });
//     let orders = await response.json();
//     return orders;
//   } catch (err) {
//     console.log(err);
//   }
// };

const getOrders = async (token: RequestCookie | undefined) => {
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
    console.log(orders);
    return orders;
  } catch (err) {
    console.log(err);
  }
};
