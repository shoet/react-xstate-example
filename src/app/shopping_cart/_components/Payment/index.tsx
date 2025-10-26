"use client";

import { useCartContext } from "../../_hooks/useCartContext";
import { AddressForm } from "../AddressForm";
import { Cart } from "../Cart";
import { PaymentForm } from "../PaymentForm";

export const Payment = () => {
  const { state, submitAddress, submitPaymentMethod } = useCartContext();

  if (state.matches("browsing")) {
    return <Cart />;
  }
  if (state.matches("checkout.inputAddress")) {
    return <AddressForm onSubmit={submitAddress} />;
  }
  if (state.matches("checkout.inputPayment")) {
    return <PaymentForm onSubmit={submitPaymentMethod} />;
  }
  return <div>{JSON.stringify({ context: state.context })}</div>;
};
