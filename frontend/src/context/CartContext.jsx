import React, { createContext, useContext, useState, useEffect } from 'react';

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BACKEND_URL = rawUrl.replace(/\/+$/, '');

const normalizeProductImage = (imgSrc) => {
  if (!imgSrc) return 'https://via.placeholder.com/200';

  // Fix nested absolute URLs created by Django serializers (e.g. localhost:8000/https://...)
  if (imgSrc.includes('://http://') || imgSrc.includes('://https://')) {
    const splitIndex = imgSrc.lastIndexOf('http');
    return imgSrc.substring(splitIndex);
  }

  // Handle local relative media paths (e.g. /media/images/phone.jpg)
  if (imgSrc.startsWith('/')) {
    return `${BACKEND_URL}${imgSrc}`;
  }

  // Replace legacy hostnames if stored in local cache
  if (imgSrc.includes('127.0.0.1:8000') || imgSrc.includes('onrender.com')) {
    return imgSrc
      .replace(/https?:\/\/127\.0\.0\.1:8000/, BACKEND_URL)
      .replace(/https?:\/\/.*\.onrender\.com/, BACKEND_URL);
  }

  return imgSrc;
};

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('teamtech_cart');
      return localData ? JSON.parse(localData) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('teamtech_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const productId = product._id || product.id;
    const maxStock = Number(product.countInStock) > 0 ? Number(product.countInStock) : 10;
    const sanitizedImage = normalizeProductImage(product.image);

    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => (x._id || x.id) === productId);

      if (existItem) {
        return prevItems.map((x) =>
          (x._id || x.id) === productId
            ? { ...existItem, qty: Math.min(existItem.qty + qty, maxStock) }
            : x
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          id: productId,
          _id: productId,
          image: sanitizedImage,
          qty: Math.min(qty, maxStock)
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => (x._id || x.id) !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);