interface ClientOrderType {
  sum: number;
  status: string;
  client: number;
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

export type { ClientOrderType };
