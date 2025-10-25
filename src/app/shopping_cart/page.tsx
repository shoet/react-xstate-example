import { getProducts } from "@/features/shopping_cart/service/getProducts";
import { ProductsContainer } from "./_components/ProductList";
import clsx from "clsx";
import { CartContextProvider } from "./_components/CartContext";
import { Cart } from "./_components/Cart";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <CartContextProvider>
      <div className={clsx("grid grid-cols-[2fr_1fr] gap-8")}>
        <div>
          <h1>ProductList</h1>
          <ProductsContainer productsPromise={getProducts()} />
        </div>
        <div>
          <div>カートの中身</div>
          <Cart />
        </div>
      </div>
    </CartContextProvider>
  );
}
