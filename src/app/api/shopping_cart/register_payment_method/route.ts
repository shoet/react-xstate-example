import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { success, error } = z
    .object({
      cardNumber: z.string().min(1),
      expiryYear: z.string().min(1),
      expiryMonth: z.string().min(1),
      cardHolder: z.string().min(1),
      securityCode: z.string().min(1),
    })
    .safeParse(body);
  if (!success) {
    console.log("BadRequest", error);
    return NextResponse.json(
      {
        message: "BadRequest",
      },
      { status: 400 },
    );
  }

  const code = crypto.randomUUID();
  const paymentMethodId = crypto.randomUUID();
  const redirectUrl = `http://localhost:3000/shopping_cart/confirm_register_payment?code=${code}`;
  return NextResponse.json(
    {
      redirectURL: redirectUrl,
      paymentMethodId: paymentMethodId,
    },
    { status: 200 },
  );
};
