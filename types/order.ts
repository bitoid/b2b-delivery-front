import { UserType } from "./user";

interface ClientOrderType {
  sum: number;
  status: string;
  client: number | null;
  id: number;
  city: string;
  addressee_full_name: string;
  phone_number: string;
  address: string;
  comment: string;
  item_price: number;
  courier_fee: number;
  created_at: string;
}

interface CommentProps {
  text: string;
}

interface OrdersContextProps {
  orders: ClientOrderType[];
  user: UserType | undefined;
  setOrders: React.Dispatch<React.SetStateAction<ClientOrderType[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

export type { ClientOrderType, CommentProps, OrdersContextProps, RowProps };
