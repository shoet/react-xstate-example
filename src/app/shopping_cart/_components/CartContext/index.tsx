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
  cartSessionId: undefined,
  addItem: () => {},
  removeItem: () => {},
  submit: async (cartSessionId: string) => {},
  state: {} as XCartState,
  submitAddress: async () => {},
  submitPaymentMethod: async () => {},
  goNextPaymentConfirm: () => {},
  submitPayment: async () => {},
});

export const CartContextProvider = (props: PropsWithChildren) => {
  const {
    cart,
    cartSessionId,
    submit,
    addItem,
    removeItem,
    state,
    submitAddress,
    submitPaymentMethod,
    goNextPaymentConfirm,
    submitPayment,
  } = useCartXState();
  return (
    <CartContext
      value={{
        cart,
        cartSessionId,
        addItem,
        removeItem,
        submit,
        state,
        submitAddress,
        submitPaymentMethod,
        goNextPaymentConfirm,
        submitPayment,
      }}
    >
      {props.children}
    </CartContext>
  );
};
