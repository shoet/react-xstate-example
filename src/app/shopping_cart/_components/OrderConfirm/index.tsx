import { Cart } from "@/features/shopping_cart/types";
import clsx from "clsx";
import { useMemo } from "react";

export const OrderConfirm = (props: { cart: Cart; onSubmit: () => void }) => {
  const cartItem = useMemo(() => {
    return Object.values(props.cart);
  }, [props.cart]);
  const ammount = useMemo(() => {
    return cartItem.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [cartItem]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      className={clsx("border border-border px-6 py-4 rounded-xl")}
    >
      <div className={clsx("flex flex-col gap-4")}>
        <div className={clsx("font-bold text-lg w-full")}>注文内容の確認</div>
        <div>
          {cartItem.length === 0 ? (
            <div>カートは空です</div>
          ) : (
            <div>
              <div>
                {cartItem.map((item) => (
                  <div key={item.product.id}>
                    <div>{item.product.name}</div>
                    <div>数量: {item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">合計金額: ¥{ammount}</div>
            </div>
          )}
        </div>
        <button
          className={clsx(
            "p-2 text-white bg-emerald-400 cursor-pointer disabled:bg-gray-300 disabled:cursor-default font-bold rounded-md",
          )}
        >
          注文を確定する
        </button>
      </div>
    </form>
  );
};
