import { submitCart } from "@/features/shopping_cart/service/submitCart";
import { Cart, Product } from "@/features/shopping_cart/types";
import { useState } from "react";

export type UseCartReturnType = {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (product: Product) => void;
  submit: () => Promise<void>;
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({});

  const addItem = (product: Product) => {
    const item = cart[product.id];
    if (!item) {
      setCart((prev) => ({
        ...prev,
        [product.id]: {
          product,
          quantity: 1,
        },
      }));
      return;
    }
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...item,
        quantity: item.quantity + 1,
      },
    }));
  };

  const removeItem = (product: Product) => {
    const { [product.id]: item, ...rest } = cart;
    if (!item) {
      return;
    }
    if (item.quantity === 1) {
      setCart({ ...rest });
      return;
    }
    setCart({
      ...rest,
      [item.product.id]: {
        product: item.product,
        quantity: item.quantity - 1,
      },
    });
  };

  const submit = async () => {
    try {
      await submitCart();
      setCart({});
    } catch (error) {
      console.error("Failed to submit cart:", error);
    }
  };

  return {
    cart,
    addItem,
    removeItem,
    submit,
  };
};
