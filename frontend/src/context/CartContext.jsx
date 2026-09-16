import React, { createContext, useContext, useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-project-3cq9.onrender.com';

const normalizeProductImage = (imgSrc) => {
  if (!imgSrc) return 'https://via.placeholder.com/200';
  if (imgSrc.includes('8000/https://') || imgSrc.includes('onrender.com/https://')) {
    return imgSrc.split(/(?:8000|onrender\.com)\//)[1];
  }
  if (imgSrc.startsWith('http://127.0.0.1:8000') || imgSrc.startsWith('http://localhost:8000')) {
    return imgSrc.replace(/http:\/\/(?:127\.0\.0\.1|localhost):8000/, BACKEND_URL);
  }
  if (imgSrc.startsWith('/')) {
    return `${BACKEND_URL}${imgSrc}`;
  }
  return imgSrc;
};

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('teamtech_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('teamtech_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const productId = product._id || product.id;
    const maxStock = product.countInStock || 10;
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
          qty
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