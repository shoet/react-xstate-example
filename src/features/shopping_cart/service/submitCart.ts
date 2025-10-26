import { Cart } from "../types";
import { sleep } from "./service";

export const submitCart = async (cart: Cart) => {
  await sleep(500);
  // throw new Error("購入処理に失敗しました");
};
