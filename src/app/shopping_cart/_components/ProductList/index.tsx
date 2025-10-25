"use client";
import { Cart, Product } from "@/features/shopping_cart/types";
import clsx from "clsx";
import { Suspense, use } from "react";
import { useCartContext } from "../../_hooks/useCartContext";

export const ProductsContainer = (props: {
  productsPromise: Promise<Product[]>;
}) => {
  const { cart, addItem, removeItem, submit } = useCartContext();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList
        cart={cart}
        productsPromise={props.productsPromise}
        onAddCartAction={addItem}
        onRemoveCartAction={removeItem}
        onSubmitAction={submit}
      />
    </Suspense>
  );
};

export const ProductList = (props: {
  cart: Cart;
  productsPromise: Promise<Product[]>;
  onAddCartAction: (product: Product) => void;
  onRemoveCartAction: (product: Product) => void;
  onSubmitAction: () => void;
}) => {
  const products = use(props.productsPromise);
  return (
    <ul>
      {products.map((p) => {
        const quantity = props.cart[p.id]?.quantity ?? 0;
        return (
          <li key={p.id} className={clsx("not-first:mt-4")}>
            <ProductCard
              product={p}
              quantity={quantity}
              onClickAdd={props.onAddCartAction}
              onClickRemove={props.onRemoveCartAction}
              onClickSubmit={props.onSubmitAction}
            />
          </li>
        );
      })}
    </ul>
  );
};

const ProductCard = (props: {
  product: Product;
  quantity: number;
  onClickAdd: (product: Product) => void;
  onClickRemove: (product: Product) => void;
  onClickSubmit: () => void;
}) => {
  const { product, quantity, onClickAdd, onClickRemove, onClickSubmit } = props;
  return (
    <div className={clsx("p-4 border border-gray-50 rounded-xl")}>
      <div>
        {product.name}: ${product.price}
      </div>
      <div className={clsx("grid grid-cols-[70px_auto_50px_auto]")}>
        <span>数量</span>
        <button onClick={() => onClickRemove(product)}>-</button>
        <div>{quantity}</div>
        <button onClick={() => onClickAdd(product)}>+</button>
      </div>
      <button
        disabled={quantity === 0}
        onClick={() => {
          if (quantity === 0) {
            return;
          }
          onClickSubmit();
        }}
      >
        カートに追加
      </button>
    </div>
  );
};
