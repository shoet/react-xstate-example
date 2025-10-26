export async function registerAddress(
  address1: string,
  address2: string,
  postalCode: string,
  phoneNumber: string,
) {
  const response = await fetch("/api/shopping_cart/register_address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address1: address1,
      address2: address2,
      postalCode: postalCode,
      phoneNumber: phoneNumber,
    }),
  });
  if (response.status !== 200) {
    const text = await response.text();
    console.error("failed to register address", text);
    throw new Error("failed to register address");
  }
  const body: {
    addressId: string;
  } = await response.json();
  return body.addressId;
}
