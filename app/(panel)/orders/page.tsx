import ClientOrder from "@/components/ClientOrder";
import { cn } from "@/lib/utils";
import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";
import { CheckIcon } from "@heroicons/react/24/outline";
import MarkedOptions from "@/components/MarkedOptions";
import Filters from "@/components/Filters";
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
  const filteredOrders: ClientOrderType[] = await getFilteredOrders(searchParams);
  const orders: ClientOrderType[] = await getOrders();
  const clientRows = [
    <CheckIcon className="block w-6 h-6 ml-[-5px]" key={Math.random()}/>,
    "ქალაქი",
    "სახელი და გვარი",
    "ტელ. ნომერ",
    "მისამართი",
    "კომენტარი",
    "ნივთის ღირებულება",
    "საკურიერო",
    "ჯამი",
    ""
  ];

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        {orders && <Filters orders={orders} searchParams={searchParams}/>}
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto overflow-y-scroll sm:-mx-6 lg:-mx-8 custom-scroll max-h-[600px]">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="sticky top-2   z-[2] bg-white box-content  ">
                  <tr>
                    {clientRows.map((item, index) => (
                      <th
                        scope="col"
                        key={index}
                        className={cn(
                          " py-3.5 text-left text-sm font-semibold text-gray-900",
                          index !== 0 ? "px-3" : ""
                        )}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredOrders?.map((order) => (
                    <ClientOrder order={order} key={order.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
