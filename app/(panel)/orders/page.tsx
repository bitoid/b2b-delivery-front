import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import queryString from "query-string";
import OrderTable from "@/components/Table";

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
  const filteredOrders: ClientOrderType[] = await getFilteredOrders(searchParams);
  const orders: ClientOrderType[] = await getOrders();


  return (
    <>
     <OrderTable data={orders} filteredData={filteredOrders} searchParams={searchParams}/>
    </>
  );
}

const getFilteredOrders = async (searchParams: ParamsType) => {
  const query = queryString.stringify(searchParams);
  console.log(query)
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
    let response = await fetch(`http://localhost:4000/orders`);
    let orders = await response.json();
    return orders;
  } catch (err) {
    console.log(err);
  }
};
