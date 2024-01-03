interface ClientOrderType {
  id: number;
  city: string;
  addressee_full_name: string;
  phone_number: string;
  address: string;
  comment: string;
  item_price: number;
  courier_fee: number;
  status: string;
  sum: string;
  created_at: string;
}

export type { ClientOrderType };
