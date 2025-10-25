"use client";
import { createContext, PropsWithChildren } from "react";
import { useCart, UseCartReturnType } from "./_hooks/useCart";

type CartContextType = UseCartReturnType;

export const CartContext = createContext<CartContextType>({
  cart: {},
  addItem: () => {},
  removeItem: () => {},
  submit: async () => {},
});

export const CartContextProvider = (props: PropsWithChildren) => {
  const { cart, submit, addItem, removeItem } = useCart();
  return (
    <CartContext
      value={{
        cart,
        addItem,
        removeItem,
        submit,
      }}
    >
      {props.children}
    </CartContext>
  );
};
