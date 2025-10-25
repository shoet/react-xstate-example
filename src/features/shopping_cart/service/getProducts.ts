import { Product } from "../types";
import { sleep } from "./service";

export const getProducts = async () => {
  await sleep(200);
  const products: Product[] = [
    { id: "1", name: "item_a", price: 200 },
    { id: "2", name: "item_b", price: 1000 },
    { id: "3", name: "item_c", price: 500 },
  ];
  return products;
};
