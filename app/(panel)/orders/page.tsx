import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import queryString from "query-string";
import OrderTable from "@/components/Table";
import Cookies from "js-cookie";

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
  const orders: ClientOrderType[] = await getOrders();
  console.log(orders);
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

const getOrders = async () => {
  try {
    const token = Cookies.get("token");

    let response = await fetch(`${process.env.DATABASE_URL}/orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
