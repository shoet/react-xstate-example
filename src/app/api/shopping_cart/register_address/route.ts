import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { success, error } = z
    .object({
      address1: z.string().min(1),
      address2: z.string().min(1),
      postalCode: z.string().min(1),
      phoneNumber: z.string().min(1),
    })
    .safeParse(body);

  if (!success) {
    console.error("BadRequest", {
      error,
    });
    return NextResponse.json(
      {
        message: "BadRequest",
      },
      {
        status: 400,
      },
    );
  }

  const uuid = crypto.randomUUID();
  return NextResponse.json(
    {
      addressId: uuid,
    },
    {
      status: 200,
    },
  );
};
