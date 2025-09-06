import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart/add', { productId, quantity });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await axios.put(`/api/cart/update/${itemId}`, { quantity });
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart item' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${itemId}`);
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete('/api/cart/clear');
      setCart(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const checkout = async (paymentMethod, shippingAddress) => {
    try {
      const response = await axios.post('/api/purchases/checkout', {
        paymentMethod,
        shippingAddress
      });
      
      // Clear cart after successful checkout
      setCart({ ...cart, items: [], totalItems: 0, totalPrice: 0 });
      
      return { success: true, purchases: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Checkout failed' 
      };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    fetchCart,
    cartItemCount: cart?.totalItems || 0,
    cartTotal: cart?.totalPrice || 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};