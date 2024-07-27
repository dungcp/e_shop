"use client";
import { CartProductType } from "@/app/product/[productId]/ProductDetail";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleQtyIncrease: (product: CartProductType) => void;
  handleQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (paymentIntent: string | null) => void;
};
export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  useEffect(() => {
    const cartItems: any = localStorage.getItem("eShopCartItems");
    const parsedCartItems = cartItems ? JSON.parse(cartItems) : null;
    const eShopPaymentIntent: any = localStorage.getItem("eShopPaymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);
    setCartProducts(parsedCartItems);
    setPaymentIntent(paymentIntent);
  }, []);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updateCart;

      if (prev) {
        updateCart = [...prev, product];
      } else {
        updateCart = [product];
      }
      toast.success("Product added to cart");
      localStorage.setItem("eShopCartItems", JSON.stringify(updateCart));
      return updateCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredCart = cartProducts.filter(
          (item) => item.id !== product.id
        );
        setCartProducts(filteredCart);
        toast.success("remove product successfully");
        localStorage.setItem("eShopCartItems", JSON.stringify(filteredCart));
      }
    },
    [cartProducts]
  );

  const handleQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 99) {
        return toast.error("Maximum quantity reached");
      }
      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );
        if (existingIndex !== -1) {
          updatedCart[existingIndex].quantity += 1;
          setCartProducts(updatedCart);
          localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
        }
      }
    },
    [cartProducts]
  );

  const handleQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) {
        return toast.error("Minimum quantity reached");
      }
      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex(
          (item) => item.id === product.id
        );
        if (existingIndex !== -1) {
          updatedCart[existingIndex].quantity -= 1;
          setCartProducts(updatedCart);
          localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
        }
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem("eShopCartItems", JSON.stringify(null));
  }, [cartProducts]);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc: any, item: CartProductType) => {
            const itemTotal = Number(item.price) * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotals();
  }, [cartProducts]);

  const handleSetPaymentIntent = useCallback(
    (value: string | null) => {
      setPaymentIntent(value);
      localStorage.setItem("eShopPaymentIntent", JSON.stringify(value));
    },
    [paymentIntent]
  );

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleQtyIncrease,
    handleQtyDecrease,
    handleClearCart,
    handleSetPaymentIntent,
    paymentIntent,
  };
  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
