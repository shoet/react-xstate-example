"use server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  console.log("formData", formData.entries());
  redirect("/shopping_cart/confirm_register_payment/success");
}
