"use client";

import { useCartContext } from "../../_hooks/useCartContext";
import { AddressForm } from "../AddressForm";
import { Cart } from "../Cart";

export const Payment = () => {
  const { state, submitAddress } = useCartContext();

  if (state.matches("browsing")) {
    return <Cart />;
  }
  if (state.matches("checkout.inputAddress")) {
    return <AddressForm onSubmit={submitAddress} />;
  }

  return <div>{JSON.stringify({ context: state.context })}</div>;
};
