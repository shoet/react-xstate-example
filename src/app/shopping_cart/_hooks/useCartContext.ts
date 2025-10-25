import { useContext } from "react";
import { CartContext } from "../_components/CartContext";

export const useCartContext = () => useContext(CartContext);
