"use client";

import { useCartContext } from "../../_hooks/useCartContext";
import { AddressForm } from "../AddressForm";
import { Cart } from "../Cart";
import { OrderConfirm } from "../OrderConfirm";
import { PaymentConfirm } from "../PaymentConfirm";
import { PaymentForm } from "../PaymentForm";

export const Payment = () => {
  const {
    state,
    submitAddress,
    submitPaymentMethod,
    goNextPaymentConfirm,
    cart,
  } = useCartContext();

  if (state.matches("browsing")) {
    return <Cart />;
  }
  if (state.matches("checkout.inputAddress")) {
    return <AddressForm onSubmit={submitAddress} />;
  }
  if (state.matches("checkout.inputPayment")) {
    return <PaymentForm onSubmit={submitPaymentMethod} />;
  }
  if (state.matches("checkout.paymentConfirmRegister")) {
    return (
      <PaymentConfirm
        redirectURL={state.context.confirmCardRedirectURL || ""}
        onNext={goNextPaymentConfirm}
      />
    );
  }
  if (state.matches("checkout.orderConfirm")) {
    return <OrderConfirm cart={cart} onSubmit={() => {}} />;
  }
  return <div>{JSON.stringify({ context: state.context })}</div>;
};
