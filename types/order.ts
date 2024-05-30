import { UserInfoType, UserType } from "./user";

interface ClientOrderType {
  sum: number;
  status: string;
  staged_status: string;
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
  courier: number | null;
  client_name: string;
  courier_name: string;
  updated_at: string;
  order_position: number;
  status_approved: boolean;
  is_taken: boolean;
}

interface CommentProps {
  text: string;
}

interface OrdersContextProps {
  orders: ClientOrderType[];
  user: UserType | undefined;
  couriers: UserInfoType[];
  clients: UserInfoType[];
  setOrders: React.Dispatch<React.SetStateAction<ClientOrderType[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

export type { ClientOrderType, CommentProps, OrdersContextProps, RowProps };
