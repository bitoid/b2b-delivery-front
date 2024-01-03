import { create } from "zustand";

type CartStore = {
  markedOrders: number[];
  add: (item: number) => void;
  remove: (index: number) => void;
};

const useMarkedOrderStore = create<CartStore>((set) => ({
  markedOrders: [],
  add: (item: number) =>
    set((state) => ({ markedOrders: [...state.markedOrders, item] })),
  remove: (item: number) =>
    set((state) => {
      const updatedCart = [...state.markedOrders];
      const index = updatedCart.indexOf(item);
      updatedCart.splice(index, 1);
      return { markedOrders: updatedCart };
    }),
}));
