import { sleep } from "./service";

export const submitCart = async () => {
  await sleep(500);
  throw new Error("購入処理に失敗しました");
};
