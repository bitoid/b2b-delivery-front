interface ClientOrderType {
  id: number;
  town: string;
  fullName: string;
  phone: string;
  address: string;
  comment: string;
  price: number;
  courierPrice: number;
  status: string;
}

export type { ClientOrderType };
