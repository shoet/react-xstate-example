import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);
  const query = url.searchParams;
  const code = query.get("code");

  if (!code) {
    return NextResponse.json({ message: "BadRequest" }, { status: 400 });
  }
  console.log("Confirm Code", { code });

  const paymentMethodId = crypto.randomUUID();

  return NextResponse.json(
    {
      paymentMethodId,
    },
    { status: 200 },
  );
};
