import ClientOrder from "@/components/ClientOrder";
import { cn } from "@/lib/utils";
import { ClientOrderType } from "@/types/orders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "გაგზავნილი შეკვეთები",
};

export default async function OrdersPage() {
  const orders: ClientOrderType[] = await getOrders();
  const clientRows = [
    "ქალაქი",
    "სახელი და გვარი",
    "ნივთის ღირებულება",
    "საკურიერო",
    "ჯამი",
  ];
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
     
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
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
                  {orders.map((order) => (
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

const getOrders = async () => {
  try {
    let response = await fetch(`${process.env.API_URL}/orders`, {
      cache: "no-store",
    });
    let orders = await response.json();
    return orders;
  } catch (err) {
    console.log(err);
  }
};
