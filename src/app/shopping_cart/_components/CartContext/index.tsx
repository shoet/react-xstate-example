"use client";
import { createContext, PropsWithChildren } from "react";
import {
  useCartXState,
  UseCartXStateReturnType,
  XCartState,
} from "./_hooks/useCartXState";

type CartContextType = UseCartXStateReturnType;

export const CartContext = createContext<CartContextType>({
  cart: {},
  addItem: () => {},
  removeItem: () => {},
  submit: async () => {},
  state: {} as XCartState,
  submitAddress: async () => {},
});

export const CartContextProvider = (props: PropsWithChildren) => {
  const { cart, submit, addItem, removeItem, state, submitAddress } =
    useCartXState();
  return (
    <CartContext
      value={{
        cart,
        addItem,
        removeItem,
        submit,
        state,
        submitAddress,
      }}
    >
      {props.children}
    </CartContext>
  );
};
