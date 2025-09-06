import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, checkout } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'cash',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);

    const result = await checkout(checkoutData.paymentMethod, checkoutData.shippingAddress);
    
    if (result.success) {
      alert('Purchase completed successfully!');
      setShowCheckoutForm(false);
    } else {
      alert(result.message);
    }
    
    setCheckoutLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shippingAddress.')) {
      const addressField = name.split('.')[1];
      setCheckoutData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else {
      setCheckoutData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="card">
                    <div className="card-body">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{item.product.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.product.category}</p>
                          <p className="text-green-600 font-bold text-lg">${item.product.price}</p>
                          <p className="text-sm text-gray-500">Condition: {item.product.condition}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <div className="card-header">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Items ({cart.totalItems})</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="btn btn-primary w-full mt-6"
                  >
                    Proceed to Checkout
                  </button>

                  <Link to="/products" className="btn btn-outline w-full mt-2">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold">Checkout</h2>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCheckout} className="card-body space-y-4">
                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="form-select"
                    value={checkoutData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        name="shippingAddress.street"
                        className="form-input"
                        value={checkoutData.shippingAddress.street}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="shippingAddress.city"
                          className="form-input"
                          value={checkoutData.shippingAddress.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="shippingAddress.state"
                          className="form-input"
                          value={checkoutData.shippingAddress.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          name="shippingAddress.zipCode"
                          className="form-input"
                          value={checkoutData.shippingAddress.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          name="shippingAddress.country"
                          className="form-input"
                          value={checkoutData.shippingAddress.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? (
                      <div className="loading"></div>
                    ) : (
                      `Complete Purchase ($${cart.totalPrice.toFixed(2)})`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;