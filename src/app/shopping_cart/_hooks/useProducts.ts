"use client";
import { getProducts } from "@/features/shopping_cart/service/getProducts";
import { Product } from "@/types/shopping_cart";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const fetchProducts = async () => {
    setError(undefined);
    try {
      setIsLoading(true);
      const products = await getProducts();
      setProducts(products);
    } catch (
      e: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    mutate: fetchProducts,
  };
};
