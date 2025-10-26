import { submitCart } from "@/features/shopping_cart/service/submitCart";
import { Cart, Product } from "@/features/shopping_cart/types";
import { useEffect, useState } from "react";

export type UseCartReturnType = {
  cart: Cart;
  cartSessionId: string;
  addItem: (product: Product) => void;
  removeItem: (product: Product) => void;
  submit: () => Promise<void>;
};

export const useCart = () => {
  const [cartSessionId, setCartSessionId] = useState<string | undefined>();
  const [cart, setCart] = useState<Cart>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setCartSessionId(crypto.randomUUID());
  }, []);

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
    setCart((prev) => {
      const item = prev[product.id];
      if (!item) {
        return prev;
      }
      if (item.quantity === 1) {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [item.product.id]: {
          product: item.product,
          quantity: item.quantity - 1,
        },
      };
    });
  };

  const submit = async () => {
    try {
      await submitCart(cart);
      setCart({});
    } catch (error) {
      console.error("Failed to submit cart:", error);
      setError(error as Error);
      throw error;
    }
  };

  return {
    cart,
    cartSessionId,
    addItem,
    removeItem,
    submit,
  };
};
