export async function registerPaymentMethod(
  cardNumber: string,
  cardHolder: string,
  expiryYear: string,
  expiryMonth: string,
  securityCode: string,
) {
  const response = await fetch("/api/shopping_cart/register_payment_method", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cardNumber,
      cardHolder,
      expiryYear,
      expiryMonth,
      securityCode,
    }),
  });
  if (response.status !== 200) {
    const text = await response.text();
    console.error("failed to register payment method", text);
    throw new Error("failed to register payment method");
  }
  const body: {
    redirectURL: string;
    paymentMethodId: string;
  } = await response.json();
  return body;
}
