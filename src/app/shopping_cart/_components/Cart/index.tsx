"use client";

import clsx from "clsx";
import { useCartContext } from "../../_hooks/useCartContext";
import { useMemo } from "react";

export const Cart = () => {
  const { cart, submit } = useCartContext();
  const cartItem = useMemo(() => {
    return Object.values(cart);
  }, [cart]);
  const ammount = useMemo(() => {
    return cartItem.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [cartItem]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await submit();
      }}
    >
      <div className={clsx("p-4 border border-gray-200 rounded-xl")}>
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
            <button
              type="submit"
              className={clsx(
                "mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600",
              )}
            >
              購入手続きへ進む
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
