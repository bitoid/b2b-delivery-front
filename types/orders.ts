interface ClientOrderType {
  id: number;
  town: string;
  fullName: string;
  phone: string;
  address: string;
  comment: string;
  price: number;
  courierPrice: number;
  total: () => number;
}

export type { ClientOrderType };
