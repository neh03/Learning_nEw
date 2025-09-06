import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchases');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [purchasesRes, salesRes] = await Promise.all([
        axios.get('/api/purchases/history'),
        axios.get('/api/purchases/sales')
      ]);
      setPurchases(purchasesRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Failed to fetch purchase data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
          <p className="text-gray-600">Track your purchases and sales</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('purchases')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchases'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Purchases ({purchases.length})
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Sales ({sales.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div>
            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your purchase history here</p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase._id} className="card">
                    <div className="card-body">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={purchase.product.images[0]}
                            alt={purchase.product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{purchase.product.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{purchase.product.category}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span>Quantity: {purchase.quantity}</span>
                            <span>From: {purchase.seller.username}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-green-600 font-bold text-lg">
                              ${purchase.totalPrice}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(purchase.status)}`}>
                              {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(purchase.createdAt)}
                          </span>
                          {purchase.trackingNumber && (
                            <span className="text-sm text-blue-600">
                              Tracking: {purchase.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {purchase.review && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium">Your Review:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < purchase.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{purchase.review}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div>
            {sales.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
                <p className="text-gray-600 mb-6">Start selling to see your sales history here</p>
                <Link to="/add-product" className="btn btn-primary">
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale._id} className="card">
                    <div className="card-body">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={sale.product.images[0]}
                            alt={sale.product.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{sale.product.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{sale.product.category}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span>Quantity: {sale.quantity}</span>
                            <span>Sold to: {sale.buyer.username}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-green-600 font-bold text-lg">
                              ${sale.totalPrice}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(sale.status)}`}>
                              {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(sale.createdAt)}
                          </span>
                          {sale.trackingNumber && (
                            <span className="text-sm text-blue-600">
                              Tracking: {sale.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {sale.review && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium">Customer Review:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < sale.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{sale.review}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-gray-900">{purchases.length}</h3>
              <p className="text-gray-600">Total Purchases</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-gray-900">{sales.length}</h3>
              <p className="text-gray-600">Total Sales</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                ${sales.reduce((sum, sale) => sum + sale.totalPrice, 0).toFixed(2)}
              </h3>
              <p className="text-gray-600">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;