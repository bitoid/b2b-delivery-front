interface ClientOrderType {
  id: number;
  town: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  comment: string;
  price: number;
  courierPrice: number;
}

export type { ClientOrderType };
