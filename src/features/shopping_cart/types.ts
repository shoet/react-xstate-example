export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = Record<string, CartItem>;
