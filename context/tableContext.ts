import { OrdersContextProps } from "@/types/order";
import { createContext } from "react";

const initialContext: OrdersContextProps = {
  orders: [],
  user: undefined,
  setIsEdit: () => {},
  setOrders: () => {},
};

export const TableContext = createContext<OrdersContextProps>(initialContext);
